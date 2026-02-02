'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ChangePasswordCard } from '@/components/ChangePasswordCard';
import { userService } from '@/services/userService';
import { USER_ROLES } from '@/utils/constants';

interface DashboardStats {
  totalRequests: number;
  approvedRequests: number;
  pendingRequests: number;
  rejectedRequests: number;
}

export default function HosteliteDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
    rejectedRequests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await userService.getHosteliteDashboard();
        if (response && response.data) {
          setStats({
            totalRequests: response.data.totalRequests || 0,
            approvedRequests: response.data.approvedRequests || 0,
            pendingRequests: response.data.pendingRequests || 0,
            rejectedRequests: response.data.rejectedRequests || 0,
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
    <ProtectedRoute allowedRoles={[USER_ROLES.HOSTELITE]}>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-gray-600 text-sm font-semibold mb-2">Total Requests</h2>
              <p className="text-3xl font-bold text-primary">{stats.totalRequests}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-gray-600 text-sm font-semibold mb-2">Approved</h2>
              <p className="text-3xl font-bold text-green-600">{stats.approvedRequests}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-gray-600 text-sm font-semibold mb-2">Pending</h2>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-gray-600 text-sm font-semibold mb-2">Rejected</h2>
              <p className="text-3xl font-bold text-red-600">{stats.rejectedRequests}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <ul className="space-y-2">
              <li>
                <a href="/hostelite/requests" className="text-blue-600 hover:underline">
                  → View All Requests
                </a>
              </li>
              <li>
                <a href="/hostelite/requests/new" className="text-blue-600 hover:underline">
                  → Submit New Request
                </a>
              </li>
              <li>
                <a href="/hostelite/profile" className="text-blue-600 hover:underline">
                  → Edit Profile
                </a>
              </li>
            </ul>
          </div>

          <ChangePasswordCard />
        </div>
      </div>
    </ProtectedRoute>
  );
}
