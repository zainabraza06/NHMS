'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { userService } from '@/services/userService';
import { USER_ROLES } from '@/utils/constants';

interface DashboardStats {
  totalAssignedTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export default function StaffDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalAssignedTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await userService.getStaffDashboard();
        if (response && response.data) {
          setStats({
            totalAssignedTasks: response.data.totalAssignedTasks || 0,
            completedTasks: response.data.completedTasks || 0,
            pendingTasks: response.data.pendingTasks || 0,
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
    <ProtectedRoute allowedRoles={[USER_ROLES.CLEANING_STAFF]}>
      <div className="page-container">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg animate-float">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Hello, {user?.firstName}!
              </h1>
              <p className="text-gray-500">Here are your cleaning tasks for today</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
              <StatCard title="Total Tasks" value={stats.totalAssignedTasks} icon="📋" gradient="from-aqua-400 to-aqua-600" delay="stagger-1" />
              <StatCard title="Completed" value={stats.completedTasks} icon="✅" gradient="from-emerald-400 to-emerald-600" delay="stagger-2" />
              <StatCard title="Pending" value={stats.pendingTasks} icon="⏳" gradient="from-amber-400 to-amber-600" delay="stagger-3" />
            </div>

            {/* Quick Actions */}
            <div className="stat-card animate-slide-up stagger-4">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">⚡</span>
                <h2 className="text-xl font-bold text-emerald-800">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickActionCard href="/staff/tasks" icon="🧹" title="My Tasks" description="View and complete your assigned tasks" />
                <QuickActionCard href="/staff/profile" icon="👤" title="My Profile" description="Update your profile settings" />
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
    <div className={`relative overflow-hidden rounded-2xl p-6 bg-white shadow-aqua border border-aqua-100/30 animate-slide-up ${delay} group hover:shadow-aqua-lg hover:-translate-y-1 transition-all duration-300`}>
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl">{icon}</span>
        </div>
        <p className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{value}</p>
        <p className="text-gray-500 text-sm mt-2">{title}</p>
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
      className="group p-6 rounded-xl border-2 border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
    >
      <span className="text-4xl block mb-3 transform group-hover:scale-110 transition-transform">{icon}</span>
      <h3 className="font-bold text-lg text-gray-800 group-hover:text-emerald-700 transition-colors">{title}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
    </a>
  );
}
