'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { userService } from '@/services/userService';
import { USER_ROLES } from '@/utils/constants';

interface DashboardStats {
  totalRequests: number;
  approvedRequests: number;
  pendingRequests: number;
  rejectedRequests: number;
  totalHostelites: number;
  totalStaff: number;
}

export default function ManagerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
    rejectedRequests: 0,
    totalHostelites: 0,
    totalStaff: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await userService.getManagerDashboard();
        if (response && response.data) {
          setStats({
            totalRequests: response.data.totalRequests || 0,
            approvedRequests: response.data.approvedRequests || 0,
            pendingRequests: response.data.pendingRequests || 0,
            rejectedRequests: response.data.rejectedRequests || 0,
            totalHostelites: response.data.totalHostelites || 0,
            totalStaff: response.data.totalStaff || 0,
          });
        } else {
          setError('Failed to load dashboard');
        }
      } catch (err) {
        setError('Error loading dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.HOSTEL_MANAGER]}>
      <div className="page-container">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg animate-float">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Welcome, {user?.firstName}!
              </h1>
              <p className="text-gray-500">Here's your hostel management overview</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert-error mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
              <StatCard title="Total Requests" value={stats.totalRequests} icon="📊" gradient="from-aqua-400 to-aqua-600" delay="stagger-1" />
              <StatCard title="Approved" value={stats.approvedRequests} icon="✅" gradient="from-emerald-400 to-emerald-600" delay="stagger-2" />
              <StatCard title="Pending" value={stats.pendingRequests} icon="⏳" gradient="from-amber-400 to-amber-600" delay="stagger-3" />
              <StatCard title="Rejected" value={stats.rejectedRequests} icon="❌" gradient="from-rose-400 to-rose-600" delay="stagger-4" />
              <StatCard title="Hostelites" value={stats.totalHostelites} icon="👥" gradient="from-blue-400 to-blue-600" delay="stagger-5" />
              <StatCard title="Staff" value={stats.totalStaff} icon="🧹" gradient="from-purple-400 to-purple-600" delay="stagger-6" />
            </div>

            {/* Quick Actions */}
            <div className="stat-card animate-slide-up">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">⚡</span>
                <h2 className="text-xl font-bold text-purple-800">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickActionCard href="/manager/requests" icon="📋" title="All Requests" description="Review and manage requests" />
                <QuickActionCard href="/manager/hostelites" icon="👥" title="Hostelites" description="View all hostelites" />
                <QuickActionCard href="/manager/staff" icon="🧹" title="Staff" description="Manage cleaning staff" />
                <QuickActionCard href="/manager/profile" icon="👤" title="My Profile" description="Update your profile" />
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  gradient: string;
  delay: string;
}

function StatCard({ title, value, icon, gradient, delay }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 bg-white shadow-aqua border border-aqua-100/30 animate-slide-up ${delay} group hover:shadow-aqua-lg hover:-translate-y-1 transition-all duration-300`}>
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">{icon}</span>
        </div>
        <p className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{value}</p>
        <p className="text-gray-500 text-sm mt-1">{title}</p>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
}

function QuickActionCard({ href, icon, title, description }: QuickActionCardProps) {
  return (
    <a
      href={href}
      className="group p-5 rounded-xl border-2 border-purple-100 bg-white hover:border-purple-300 hover:shadow-lg transition-all duration-300"
    >
      <span className="text-3xl block mb-3 transform group-hover:scale-110 transition-transform">{icon}</span>
      <h3 className="font-bold text-gray-800 group-hover:text-purple-700 transition-colors">{title}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
    </a>
  );
}
