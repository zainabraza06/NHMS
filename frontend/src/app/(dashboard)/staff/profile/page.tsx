'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { userService } from '@/services/userService';
import { USER_ROLES } from '@/utils/constants';

interface StaffProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  staffId?: string;
  assignedHostels?: string[];
  assignedFloors?: string[];
  salary?: number;
  joinDate?: string;
}

export default function StaffProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getStaffProfile();
        if (response.success && response.data) {
          const profileData: StaffProfile = {
            id: response.data._id || response.data.id || '',
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            staffId: response.data.staffId,
            assignedHostels: response.data.assignedHostels?.map((h: any) => 
              typeof h === 'string' ? h : h?.name
            ),
            assignedFloors: response.data.assignedFloors,
            salary: response.data.salary,
            joinDate: response.data.joinDate,
          };
          setProfile(profileData);
          setFormData({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phoneNumber: profileData.phoneNumber,
          });
        } else {
          setError('Failed to load profile');
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await userService.updateStaffProfile(formData);
      if (response.success) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        if (profile) {
          setProfile({
            ...profile,
            ...formData,
          });
        }
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={[USER_ROLES.CLEANING_STAFF]}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.CLEANING_STAFF]}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {!isEditing ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm">First Name</p>
                <p className="text-lg font-semibold">{profile?.firstName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Last Name</p>
                <p className="text-lg font-semibold">{profile?.lastName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg font-semibold">{profile?.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone Number</p>
                <p className="text-lg font-semibold">{profile?.phoneNumber}</p>
              </div>
              {profile?.staffId && (
                <div>
                  <p className="text-gray-600 text-sm">Staff ID</p>
                  <p className="text-lg font-semibold">{profile.staffId}</p>
                </div>
              )}
              {profile?.assignedHostels && profile.assignedHostels.length > 0 && (
                <div>
                  <p className="text-gray-600 text-sm">Assigned Hostels</p>
                  <p className="text-lg font-semibold">{profile.assignedHostels.join(', ')}</p>
                </div>
              )}
              {profile?.salary && (
                <div>
                  <p className="text-gray-600 text-sm">Salary</p>
                  <p className="text-lg font-semibold">Rs. {profile.salary}</p>
                </div>
              )}
              {profile?.joinDate && (
                <div>
                  <p className="text-gray-600 text-sm">Join Date</p>
                  <p className="text-lg font-semibold">
                    {new Date(profile.joinDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
