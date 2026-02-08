'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { USER_ROLES } from '@/utils/constants';
import { adminService } from '@/services/api';

export default function AdminUsersPage() {
    const [hostelites, setHostelites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await adminService.getAllHostelitesGlobal(1, 100);
            if (response.success) {
                setHostelites(response.data || []);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <div className="page-container">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
                    <p className="text-slate-500">Oversight of all system users</p>
                </header>

                {error && <div className="alert-error mb-6">{error}</div>}

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                        <h2 className="font-black text-slate-700 uppercase tracking-widest text-xs">Hostelites (Latest 100)</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/20">
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Name</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">ID / Email</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Hostel</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Room</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">Loading users...</td></tr>
                                ) : hostelites.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No users found</td></tr>
                                ) : hostelites.map((user: any) => (
                                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800">{user.firstName} {user.lastName}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-slate-600">{user.universityId}</p>
                                            <p className="text-xs text-slate-400">{user.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                                            {user.hostel?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-black text-aqua-600">
                                            {user.roomNumber}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
