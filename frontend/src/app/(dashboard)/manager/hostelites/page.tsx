'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { userService } from '@/services/userService';
import { USER_ROLES } from '@/utils/constants';
import { User } from '@/types';

export default function ManagerHostelitesPage() {
  const { user } = useAuth();
  const [hostelites, setHostelites] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHostelites = async () => {
      try {
        const response = await userService.getAllHostelites();
        if (response.success && response.data) {
          setHostelites(Array.isArray(response.data) ? response.data : []);
        } else {
          setError('Failed to load hostelites');
        }
      } catch (err) {
        setError('Error loading hostelites');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHostelites();
  }, []);

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.HOSTEL_MANAGER]}>
      <div className="page-container">
        <h1 className="section-header">Manage Hostelites</h1>

        {error && (
          <div className="alert-error mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : hostelites.length === 0 ? (
          <div className="stat-card text-center py-12 animate-scale-in">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-500 text-lg">No hostelites found</p>
          </div>
        ) : (
          <div className="stat-card overflow-hidden animate-scale-in p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-aqua-500 to-aqua-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">University ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Room</th>
                    <th className="px-6 py-4 text-left font-semibold">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {hostelites.map((hostelite, index) => (
                    <tr
                      key={hostelite._id}
                      className={`border-b border-aqua-100/50 transition-colors duration-200 hover:bg-aqua-50/50
                        ${index % 2 === 0 ? 'bg-white' : 'bg-aqua-50/30'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-aqua-400 to-aqua-500 flex items-center justify-center text-white text-xs font-bold mr-3">
                            {hostelite.firstName?.[0]}{hostelite.lastName?.[0]}
                          </div>
                          <span className="font-medium text-gray-800">
                            {hostelite.firstName} {hostelite.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{hostelite.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-aqua-100 text-aqua-700 rounded-md text-sm font-medium">
                          {(hostelite as any).universityId || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{(hostelite as any).roomNumber || '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{(hostelite as any).department || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
