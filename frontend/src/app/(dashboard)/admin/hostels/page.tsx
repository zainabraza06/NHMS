'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { USER_ROLES } from '@/utils/constants';
import { Hostel } from '@/types';

type HostelFormData = {
    name: string;
    hostelCode: string;
    location: string;
    totalRooms: string;
    totalFloors: string;
    messStatus: Hostel['messStatus'];
    messCharges: string;
    description: string;
    facilities: string;
};

export default function AdminHostelsPage() {
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showManagerForm, setShowManagerForm] = useState(false);
    const [managerSubmitting, setManagerSubmitting] = useState(false);
    const [managerRemovingId, setManagerRemovingId] = useState('');
    const [managerForm, setManagerForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        hostel: ''
    });
    const [formData, setFormData] = useState<HostelFormData>({
        name: '',
        hostelCode: '',
        location: '',
        totalRooms: '',
        totalFloors: '',
        messStatus: 'ACTIVE',
        messCharges: '',
        description: '',
        facilities: ''
    });

    useEffect(() => {
        fetchHostels();
    }, []);

    const fetchHostels = async () => {
        try {
            const response = await adminService.getAllHostels();
            if (response.success) {
                setHostels(response.data || []);
            }
        } catch (err) {
            setError('Failed to fetch hostels');
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
            const response = await adminService.createHostel({
                name: formData.name.trim(),
                hostelCode: formData.hostelCode.trim(),
                location: formData.location.trim(),
                totalRooms: Number(formData.totalRooms),
                totalFloors: Number(formData.totalFloors),
                messStatus: formData.messStatus,
                messCharges: formData.messCharges ? Number(formData.messCharges) : 0,
                description: formData.description.trim(),
                facilities: formData.facilities
                    .split(',')
                    .map((facility) => facility.trim())
                    .filter(Boolean)
            });

            if (response.success) {
                setSuccess('Hostel created successfully');
                setShowForm(false);
                setFormData({
                    name: '',
                    hostelCode: '',
                    location: '',
                    totalRooms: '',
                    totalFloors: '',
                    messStatus: 'ACTIVE',
                    messCharges: '',
                    description: '',
                    facilities: ''
                });
                await fetchHostels();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(response.message || 'Failed to create hostel');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create hostel');
        } finally {
            setSubmitting(false);
        }
    };

    const handleManagerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setManagerSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await adminService.createHostelManager(managerForm);
            if (response.success) {
                setSuccess('Manager created and assigned successfully');
                setShowManagerForm(false);
                setManagerForm({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    phoneNumber: '',
                    hostel: ''
                });
                await fetchHostels();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(response.message || 'Failed to create manager');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create manager');
        } finally {
            setManagerSubmitting(false);
        }
    };

    const handleRemoveManager = async (managerId: string) => {
        if (!confirm('Remove this manager and unassign the hostel?')) {
            return;
        }

        setManagerRemovingId(managerId);
        setError('');
        setSuccess('');

        try {
            const response = await adminService.deleteHostelManager(managerId);
            if (response.success) {
                setSuccess('Manager removed successfully');
                await fetchHostels();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(response.message || 'Failed to remove manager');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to remove manager');
        } finally {
            setManagerRemovingId('');
        }
    };

    return (
        <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <div className="page-container">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Hostel Management</h1>
                        <p className="text-slate-500">Monitor and manage all hostels in the system</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setShowForm((prev) => !prev)}
                            className="bg-aqua-500 hover:bg-aqua-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            {showForm ? 'Close Hostel Form' : '+ Add Hostel'}
                        </button>
                        <button
                            onClick={() => setShowManagerForm((prev) => !prev)}
                            className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            {showManagerForm ? 'Close Manager Form' : '+ Add Manager'}
                        </button>
                    </div>
                </header>

                {error && <div className="alert-error mb-6">{error}</div>}
                {success && <div className="alert-success mb-6">{success}</div>}

                {showForm && (
                    <div className="glass-card p-8 mb-8 border border-white/50 shadow-2xl animate-scale-in">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Hostel Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Hostel Code</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.hostelCode}
                                        onChange={(e) => setFormData({ ...formData, hostelCode: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Total Rooms</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        value={formData.totalRooms}
                                        onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Total Floors</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        value={formData.totalFloors}
                                        onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Mess Status</label>
                                    <select
                                        value={formData.messStatus}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                messStatus: e.target.value as Hostel['messStatus']
                                            })
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                        <option value="CLOSED">Closed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Mess Charges</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.messCharges}
                                        onChange={(e) => setFormData({ ...formData, messCharges: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Facilities (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={formData.facilities}
                                        onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                            <button
                                disabled={submitting}
                                className="w-full bg-gradient-to-r from-aqua-600 to-aqua-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                {submitting ? 'Creating...' : 'Create Hostel'}
                            </button>
                        </form>
                    </div>
                )}

                {showManagerForm && (
                    <div className="glass-card p-8 mb-8 border border-white/50 shadow-2xl animate-scale-in">
                        <form onSubmit={handleManagerSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={managerForm.firstName}
                                        onChange={(e) => setManagerForm({ ...managerForm, firstName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={managerForm.lastName}
                                        onChange={(e) => setManagerForm({ ...managerForm, lastName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={managerForm.email}
                                        onChange={(e) => setManagerForm({ ...managerForm, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                    <input
                                        required
                                        type="password"
                                        value={managerForm.password}
                                        onChange={(e) => setManagerForm({ ...managerForm, password: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                    <input
                                        required
                                        type="text"
                                        value={managerForm.phoneNumber}
                                        onChange={(e) => setManagerForm({ ...managerForm, phoneNumber: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Assign Hostel</label>
                                    <select
                                        required
                                        value={managerForm.hostel}
                                        onChange={(e) => setManagerForm({ ...managerForm, hostel: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-400 outline-none transition-all"
                                    >
                                        <option value="">Select an unassigned hostel</option>
                                        {hostels.filter((hostel) => !hostel.manager).map((hostel) => (
                                            <option key={hostel._id || hostel.id} value={hostel._id || hostel.id}>
                                                {hostel.name}
                                            </option>
                                        ))}
                                    </select>
                                    {hostels.filter((hostel) => !hostel.manager).length === 0 && (
                                        <p className="text-xs text-amber-600 mt-2 font-medium">All hostels already have managers.</p>
                                    )}
                                </div>
                            </div>
                            <button
                                disabled={managerSubmitting}
                                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                {managerSubmitting ? 'Creating...' : 'Create Manager'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-12"><div className="spinner"></div></div>
                    ) : hostels.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-slate-400 font-semibold bg-white rounded-3xl border border-dashed border-slate-200">
                            No hostels registered in the system
                        </div>
                    ) : hostels.map((hostel: any) => (
                        <div key={hostel._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-aqua-sm transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-aqua-400 to-aqua-600 flex items-center justify-center text-white text-xl font-bold shadow-aqua-sm transition-transform group-hover:scale-110">
                                    {hostel.name[0]}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                                    {hostel.hostelCode}
                                </span>
                            </div>

                            <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-aqua-600 transition-colors uppercase">{hostel.name}</h3>
                            <p className="text-sm text-slate-500 font-medium mb-4 flex items-center gap-1 italic">
                                📍 {hostel.location}
                            </p>

                            <div className="space-y-3 pt-4 border-t border-slate-50">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Capacity</span>
                                    <span className="text-sm font-black text-slate-700">{hostel.totalRooms} Rooms</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Occupancy</span>
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const occupancy = hostel.totalRooms
                                                ? Math.round((hostel.occupiedRooms / hostel.totalRooms) * 100)
                                                : 0;
                                            return (
                                                <>
                                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-aqua-500 rounded-full"
                                                            style={{ width: `${occupancy}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-600">
                                                        {occupancy}%
                                                    </span>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Manager</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black text-aqua-700 underline decoration-aqua-100 underline-offset-4">
                                            {hostel.manager ? `${hostel.manager.firstName} ${hostel.manager.lastName}` : 'Unassigned'}
                                        </span>
                                        {hostel.manager && hostel.manager._id && (
                                            <button
                                                onClick={() => handleRemoveManager(hostel.manager._id)}
                                                disabled={managerRemovingId === hostel.manager._id}
                                                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-60"
                                            >
                                                {managerRemovingId === hostel.manager._id ? 'Removing...' : 'Remove'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ProtectedRoute>
    );
}
