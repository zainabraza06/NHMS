'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { USER_ROLES } from '@/utils/constants';
import { adminService } from '@/services/api';
import { Hostel } from '@/types';

export default function AdminUsersPage() {
    const [hostelites, setHostelites] = useState<any[]>([]);
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [rooms, setRooms] = useState<string[]>([]);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        universityId: '',
        department: '',
        academicYear: '1',
        roomNumber: '',
        hostel: '',
        admissionDate: '',
        validUpto: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchHostels();
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

    const fetchHostels = async () => {
        try {
            const response = await adminService.getAllHostels();
            if (response.success) {
                setHostels(response.data || []);
            }
        } catch (err) {
            setError('Failed to fetch hostels');
        }
    };

    const fetchAvailableRooms = async (hostelId: string) => {
        if (!hostelId) {
            setRooms([]);
            return;
        }

        setRoomsLoading(true);
        try {
            const response = await adminService.getAvailableRooms(hostelId);
            if (response.success) {
                setRooms(response.data || []);
            } else {
                setRooms([]);
            }
        } catch (err) {
            setRooms([]);
        } finally {
            setRoomsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await adminService.createHostelite({
                ...formData,
                academicYear: Number(formData.academicYear),
                admissionDate: formData.admissionDate || undefined,
                validUpto: formData.validUpto || undefined
            });

            if (response.success) {
                setSuccess('Hostelite created successfully');
                setShowForm(false);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    phoneNumber: '',
                    universityId: '',
                    department: '',
                    academicYear: '1',
                    roomNumber: '',
                    hostel: '',
                    admissionDate: '',
                    validUpto: ''
                });
                setRooms([]);
                await fetchUsers();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(response.message || 'Failed to create hostelite');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create hostelite');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (hosteliteId: string) => {
        if (!confirm('Remove this hostelite?')) {
            return;
        }

        try {
            const response = await adminService.deleteHostelite(hosteliteId);
            if (response.success) {
                setHostelites((prev) => prev.filter((item) => item._id !== hosteliteId));
            } else {
                setError(response.message || 'Failed to remove hostelite');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to remove hostelite');
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
                {success && <div className="alert-success mb-6">{success}</div>}

                <div className="mb-6">
                    <button
                        onClick={() => setShowForm((prev) => !prev)}
                        className="bg-aqua-500 hover:bg-aqua-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        {showForm ? 'Close Form' : '+ Add Hostelite'}
                    </button>
                </div>

                {showForm && (
                    <div className="glass-card p-8 mb-8 border border-white/50 shadow-2xl animate-scale-in">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                    <input
                                        required
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">University ID</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.universityId}
                                        onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Academic Year</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        max="4"
                                        value={formData.academicYear}
                                        onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Hostel</label>
                                    <select
                                        required
                                        value={formData.hostel}
                                        onChange={(e) => {
                                            const nextHostel = e.target.value;
                                            setFormData({ ...formData, hostel: nextHostel, roomNumber: '' });
                                            fetchAvailableRooms(nextHostel);
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    >
                                        <option value="">Select a hostel</option>
                                        {hostels.map((hostel) => (
                                            <option key={hostel._id || hostel.id} value={hostel._id || hostel.id}>
                                                {hostel.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Admission Date</label>
                                    <input
                                        type="date"
                                        value={formData.admissionDate}
                                        onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Valid Upto</label>
                                    <input
                                        type="date"
                                        value={formData.validUpto}
                                        onChange={(e) => setFormData({ ...formData, validUpto: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Room Number</label>
                                    <select
                                        required
                                        disabled={!formData.hostel || roomsLoading}
                                        value={formData.roomNumber}
                                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all disabled:opacity-60"
                                    >
                                        <option value="">
                                            {roomsLoading ? 'Loading rooms...' : 'Select a room'}
                                        </option>
                                        {rooms.map((room) => (
                                            <option key={room} value={room}>
                                                {room}
                                            </option>
                                        ))}
                                    </select>
                                    {!roomsLoading && formData.hostel && rooms.length === 0 && (
                                        <p className="text-xs text-rose-500 mt-2 font-medium">No rooms available</p>
                                    )}
                                </div>
                            </div>
                            <button
                                disabled={submitting}
                                className="w-full bg-gradient-to-r from-aqua-600 to-aqua-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                {submitting ? 'Creating...' : 'Create Hostelite'}
                            </button>
                        </form>
                    </div>
                )}

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
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading users...</td></tr>
                                ) : hostelites.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No users found</td></tr>
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
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                            >
                                                Remove
                                            </button>
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
