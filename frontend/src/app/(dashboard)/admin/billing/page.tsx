'use client';

import { useState, useEffect } from 'react';
import { billingService, adminService } from '@/services/api';
import { userService } from '@/services/userService';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { USER_ROLES } from '@/utils/constants';
import { Challan, Hostel } from '@/types';

export default function AdminBillingPage() {
    const [challans, setChallans] = useState<Challan[]>([]);
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [statusFilter, setStatusFilter] = useState('');
    const [hostelFilter, setHostelFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [hosteliteFilter, setHosteliteFilter] = useState('');
    const [hostelites, setHostelites] = useState<any[]>([]);

    useEffect(() => {
        fetchHostels();
    }, []);

    useEffect(() => {
        fetchHostelites();
        setHosteliteFilter(''); // Reset student filter when hostel changes
    }, [hostelFilter]);

    useEffect(() => {
        fetchChallans();
    }, [page, statusFilter, hostelFilter, monthFilter, hosteliteFilter]);

    const fetchHostels = async () => {
        try {
            const response = await adminService.getAllHostels();
            if (response.success) setHostels(response.data || []);
        } catch (err) { console.error(err); }
    };

    const fetchHostelites = async () => {
        try {
            const response = await adminService.getAllHostelitesGlobal(1, 100, { hostel: hostelFilter || undefined });
            if (response.success) setHostelites(response.data || []);
        } catch (err) { console.error(err); }
    };

    const fetchChallans = async () => {
        setLoading(true);
        try {
            const response = await billingService.getGlobalChallans(page, 10, {
                status: statusFilter || undefined,
                hostel: hostelFilter || undefined,
                month: monthFilter || undefined,
                hostelite: hosteliteFilter || undefined
            });
            if (response.success) {
                setChallans(response.data || []);
                setTotalPages(response.pagination?.pages || 1);
                setTotalItems(response.pagination?.total || 0);
            }
        } catch (err) {
            setError('Failed to fetch global challans');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'UNPAID': return 'bg-amber-100 text-amber-600';
            case 'PAID': return 'bg-emerald-100 text-emerald-600';
            case 'OVERDUE': return 'bg-rose-100 text-rose-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <div className="page-container">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Global Billing</h1>
                        <p className="text-slate-500">Monitor all student challans across hostels</p>
                    </div>

                    <div className="flex flex-wrap gap-3 items-end">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Month</label>
                            <input
                                type="month"
                                value={monthFilter ? `${monthFilter.split('-')[1]}-${monthFilter.split('-')[0]}` : ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (!val) { setMonthFilter(''); }
                                    else {
                                        const [y, m] = val.split('-');
                                        setMonthFilter(`${m}-${y}`);
                                    }
                                    setPage(1);
                                }}
                                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-aqua-400 transition-all min-w-[150px]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Hostel</label>
                            <select
                                value={hostelFilter}
                                onChange={(e) => { setHostelFilter(e.target.value); setPage(1); }}
                                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-aqua-400 transition-all min-w-[150px]"
                            >
                                <option value="">All Hostels</option>
                                {hostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Student</label>
                            <select
                                value={hosteliteFilter}
                                onChange={(e) => { setHosteliteFilter(e.target.value); setPage(1); }}
                                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-aqua-400 transition-all min-w-[180px]"
                            >
                                <option value="">All Students</option>
                                {hostelites.map(h => (
                                    <option key={h._id} value={h._id}>
                                        {h.firstName} {h.lastName} ({h.universityId})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-aqua-400 transition-all min-w-[150px]"
                            >
                                <option value="">All Statuses</option>
                                <option value="UNPAID">Unpaid</option>
                                <option value="PAID">Paid</option>
                                <option value="OVERDUE">Overdue</option>
                            </select>
                        </div>

                        <button
                            onClick={() => {
                                setMonthFilter('');
                                setHostelFilter('');
                                setHosteliteFilter('');
                                setStatusFilter('');
                                setPage(1);
                            }}
                            className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-aqua-600 transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </header>

                {error && <div className="alert-error mb-6">{error}</div>}

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Hostelite</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Hostel</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Month</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading challans...</td></tr>
                                ) : challans.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No challans found</td></tr>
                                ) : challans.map((challan: any) => (
                                    <tr key={challan._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800">{challan.hostelite?.firstName} {challan.hostelite?.lastName}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Room: {challan.hostelite?.roomNumber}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                                            {challan.hostelite?.hostel?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">
                                            {challan.month}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-black text-slate-800">PKR {challan.totalAmount.toLocaleString()}</p>
                                            {challan.penalty > 0 && <p className="text-[10px] text-rose-500 font-bold italic">Inc. {challan.penalty} penalty</p>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusColor(challan.status)}`}>
                                                {challan.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                                            {new Date(challan.dueDate).toLocaleDateString()}
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
                                className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-sm disabled:opacity-50 hover:bg-slate-50 transition-all"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-sm disabled:opacity-50 hover:bg-slate-50 transition-all"
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
