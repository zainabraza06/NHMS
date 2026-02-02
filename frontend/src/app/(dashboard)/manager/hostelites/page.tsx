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
        const response = await userService.getManagerAllHostelites();
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Manage Hostelites</h1>

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
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">University ID</th>
                  <th className="px-6 py-3 text-left">Room</th>
                  <th className="px-6 py-3 text-left">Department</th>
                </tr>
              </thead>
              <tbody>
                {hostelites.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-600">
                      No hostelites found
                    </td>
                  </tr>
                ) : (
                  hostelites.map((hostelite) => (
                    <tr key={hostelite._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {hostelite.firstName} {hostelite.lastName}
                      </td>
                      <td className="px-6 py-4">{hostelite.email}</td>
                      <td className="px-6 py-4">{(hostelite as any).universityId || '-'}</td>
                      <td className="px-6 py-4">{(hostelite as any).roomNumber || '-'}</td>
                      <td className="px-6 py-4">{(hostelite as any).department || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
