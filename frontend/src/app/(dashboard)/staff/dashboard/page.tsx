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
        if (response.success && response.data) {
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-gray-600 text-sm font-semibold mb-2">Total Tasks</h2>
                <p className="text-3xl font-bold text-primary">{stats.totalAssignedTasks}</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-gray-600 text-sm font-semibold mb-2">Completed</h2>
                <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-gray-600 text-sm font-semibold mb-2">Pending</h2>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingTasks}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <ul className="space-y-2">
                  <li>
                    <a href="/staff/tasks" className="text-blue-600 hover:underline">
                      → View My Tasks
                    </a>
                  </li>
                  <li>
                    <a href="/staff/profile" className="text-blue-600 hover:underline">
                      → Edit Profile
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
