'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { USER_ROLES } from '@/utils/constants';
import { Hostel } from '@/types';

export default function AdminHostelsPage() {
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    return (
        <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <div className="page-container">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Hostel Management</h1>
                        <p className="text-slate-500">Monitor and manage all hostels in the system</p>
                    </div>
                    {/* Add Hostel button could go here */}
                </header>

                {error && <div className="alert-error mb-6">{error}</div>}

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
                                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-aqua-500 rounded-full"
                                                style={{ width: `${(hostel.occupiedRooms / hostel.totalRooms) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-600">
                                            {Math.round((hostel.occupiedRooms / hostel.totalRooms) * 100)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Manager</span>
                                    <span className="text-sm font-black text-aqua-700 underline decoration-aqua-100 underline-offset-4">
                                        {hostel.manager ? `${hostel.manager.firstName} ${hostel.manager.lastName}` : 'Unassigned'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ProtectedRoute>
    );
}
