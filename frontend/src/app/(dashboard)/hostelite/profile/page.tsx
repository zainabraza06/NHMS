'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { userService } from '@/services/userService';
import { USER_ROLES } from '@/utils/constants';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  universityId?: string;
  department?: string;
  academicYear?: string;
  roomNumber?: string;
  hostel?: string;
}

export default function HosteliteProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
        const response = await userService.getHosteliteProfile();
        if (response.success && response.data) {
          setProfile(response.data);
          setFormData({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phoneNumber: response.data.phoneNumber,
          });
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
      const response = await userService.updateHosteliteProfile(formData);
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
      <ProtectedRoute allowedRoles={[USER_ROLES.HOSTELITE]}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.HOSTELITE]}>
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
              {profile?.universityId && (
                <div>
                  <p className="text-gray-600 text-sm">University ID</p>
                  <p className="text-lg font-semibold">{profile.universityId}</p>
                </div>
              )}
              {profile?.department && (
                <div>
                  <p className="text-gray-600 text-sm">Department</p>
                  <p className="text-lg font-semibold">{profile.department}</p>
                </div>
              )}
              {profile?.academicYear && (
                <div>
                  <p className="text-gray-600 text-sm">Academic Year</p>
                  <p className="text-lg font-semibold">{profile.academicYear}</p>
                </div>
              )}
              {profile?.roomNumber && (
                <div>
                  <p className="text-gray-600 text-sm">Room Number</p>
                  <p className="text-lg font-semibold">{profile.roomNumber}</p>
                </div>
              )}
              {profile?.hostel && (
                <div>
                  <p className="text-gray-600 text-sm">Hostel</p>
                  <p className="text-lg font-semibold">{profile.hostel}</p>
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
