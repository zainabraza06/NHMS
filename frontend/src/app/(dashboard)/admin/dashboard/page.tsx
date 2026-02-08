'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { USER_ROLES } from '@/utils/constants';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await adminService.getGlobalStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            setError('Failed to fetch global statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><div className="spinner"></div></div>;

    return (
        <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <div className="page-container">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                    <p className="text-slate-500">Global system monitoring and oversight</p>
                </header>

                {error && <div className="alert-error mb-6">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <DashboardCard
                        title="Total Users"
                        value={stats?.users?.total || 0}
                        icon="👥"
                        details={`${stats?.users?.hostelites || 0} Hostelites · ${stats?.users?.managers || 0} Managers`}
                    />
                    <DashboardCard
                        title="Active Hostels"
                        value={stats?.hostels || 0}
                        icon="🏢"
                        details="Across all campuses"
                    />
                    <DashboardCard
                        title="Complaints"
                        value={stats?.complaints?.total || 0}
                        icon="📢"
                        details={`${stats?.complaints?.pending || 0} Pending · ${stats?.complaints?.resolved || 0} Resolved`}
                        trend={stats?.complaints?.pending > 0 ? 'High Priority' : 'All Clear'}
                        trendColor={stats?.complaints?.pending > 0 ? 'text-rose-500' : 'text-emerald-500'}
                    />
                    <DashboardCard
                        title="Total Requests"
                        value={stats?.requests?.total || 0}
                        icon="📝"
                        details={`${stats?.requests?.pending || 0} Pending · ${stats?.requests?.approved || 0} Approved`}
                    />
                </div>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Links</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <AdminActionCard
                                title="Monitor Complaints"
                                description="View and manage all complaints globally"
                                href="/admin/complaints"
                                icon="📢"
                            />
                            <AdminActionCard
                                title="System Requests"
                                description="Monitor all leave and cleaning requests"
                                href="/admin/requests"
                                icon="📝"
                            />
                            <AdminActionCard
                                title="Manage Hostels"
                                description="Add or edit hostel information"
                                href="/admin/hostels"
                                icon="🏢"
                            />
                            <AdminActionCard
                                title="User Management"
                                description="System-wide user oversight"
                                href="/admin/users"
                                icon="👥"
                            />
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">System Health</h2>
                        <div className="space-y-4">
                            <HealthItem label="API Status" status="Operational" color="bg-emerald-500" />
                            <HealthItem label="Database" status="Connected" color="bg-emerald-500" />
                            <HealthItem label="Storage" status="82% Free" color="bg-aqua-500" />
                            <HealthItem label="Auth Service" status="Operational" color="bg-emerald-500" />
                        </div>
                    </div>
                </section>
            </div>
        </ProtectedRoute>
    );
}

function DashboardCard({ title, value, icon, details, trend, trendColor }: any) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-aqua-sm hover:shadow-aqua transition-all group">
            <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">{icon}</span>
                {trend && <span className={`text-[10px] font-bold uppercase tracking-wider ${trendColor}`}>{trend}</span>}
            </div>
            <h3 className="text-slate-500 text-sm font-semibold mb-1">{title}</h3>
            <p className="text-4xl font-black text-slate-800 mb-2">{value}</p>
            <p className="text-xs text-slate-400 font-medium">{details}</p>
        </div>
    );
}

function AdminActionCard({ title, description, href, icon }: any) {
    return (
        <Link href={href} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-aqua-300 hover:shadow-aqua-sm transition-all group">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-aqua-50 transition-colors">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-slate-800 group-hover:text-aqua-600 transition-colors">{title}</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{description}</p>
            </div>
        </Link>
    );
}

function HealthItem({ label, status, color }: any) {
    return (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-slate-600">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{status}</span>
                <div className={`w-2 h-2 rounded-full ${color}`}></div>
            </div>
        </div>
    );
}
