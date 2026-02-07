'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { userService } from '@/services/userService';
import { USER_ROLES } from '@/utils/constants';
import { User } from '@/types';

export default function ManagerStaffPage() {
  const { user } = useAuth();
  const [staff, setStaff] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await userService.getAllStaff();
        if (response.success && response.data) {
          setStaff(Array.isArray(response.data) ? response.data : []);
        } else {
          setError('Failed to load staff');
        }
      } catch (err) {
        setError('Error loading staff');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.HOSTEL_MANAGER]}>
      <div className="page-container">
        <h1 className="section-header">Manage Staff</h1>

        {error && (
          <div className="alert-error mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : staff.length === 0 ? (
          <div className="stat-card text-center py-12 animate-scale-in">
            <div className="text-6xl mb-4">🧹</div>
            <p className="text-gray-500 text-lg">No staff found</p>
          </div>
        ) : (
          <div className="stat-card overflow-hidden animate-scale-in p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-aqua-500 to-aqua-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Staff ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Assigned Hostels</th>
                    <th className="px-6 py-4 text-left font-semibold">Active Requests</th>
                    <th className="px-6 py-4 text-left font-semibold">Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member, index) => (
                    <tr
                      key={member._id}
                      className={`border-b border-aqua-100/50 transition-colors duration-200 hover:bg-aqua-50/50
                        ${index % 2 === 0 ? 'bg-white' : 'bg-aqua-50/30'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold mr-3">
                            {member.firstName?.[0]}{member.lastName?.[0]}
                          </div>
                          <span className="font-medium text-gray-800">
                            {member.firstName} {member.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{member.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-sm font-medium">
                          {(member as any).staffId || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatAssignedHostels((member as any).assignedHostels)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-sm font-medium">
                          {(member as any).activeCleaningRequests ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {(member as any).salary ? (
                          <span className="font-semibold text-aqua-700">
                            Rs. {(member as any).salary.toLocaleString()}
                          </span>
                        ) : '-'}
                      </td>
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

function formatAssignedHostels(hostels?: Array<any>) {
  if (!hostels || hostels.length === 0) {
    return '-';
  }

  return hostels
    .map((hostel) => (typeof hostel === 'string' ? hostel : hostel?.name))
    .filter(Boolean)
    .join(', ') || '-';
}
