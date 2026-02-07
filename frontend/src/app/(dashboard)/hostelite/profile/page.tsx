'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
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
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Password Change State
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getHosteliteProfile();
        if (response.success && response.data) {
          const profileData: UserProfile = {
            id: response.data._id || response.data.id || '',
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            universityId: response.data.universityId,
            department: response.data.department,
            academicYear: String(response.data.academicYear),
            roomNumber: response.data.roomNumber,
            hostel: typeof response.data.hostel === 'string' ? response.data.hostel : response.data.hostel?.name,
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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    if (profile) {
      const changed =
        updatedFormData.firstName !== profile.firstName ||
        updatedFormData.lastName !== profile.lastName ||
        updatedFormData.phoneNumber !== profile.phoneNumber;
      setHasChanges(changed);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await userService.updateHosteliteProfile(formData);
      if (response.success) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        setHasChanges(false);
        if (profile) {
          setProfile({ ...profile, ...formData });
        }
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await authService.changePassword(passwords.current, passwords.new);
      if (response.message) {
        setSuccess('Password updated successfully');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        setError('Failed to update password');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error updating password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={[USER_ROLES.HOSTELITE]}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="spinner"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.HOSTELITE]}>
      <div className="page-container max-w-4xl">
        <h1 className="section-header">Account Settings</h1>

        {error && <div className="alert-error mb-6">{error}</div>}
        {success && <div className="alert-success mb-6">{success}</div>}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="md:w-1/3">
            <div className="stat-card p-4 sticky top-8">
              <div className="flex items-center gap-4 mb-8 p-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aqua-400 to-aqua-600 flex items-center justify-center text-white text-xl font-bold shadow-aqua">
                  {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">{profile?.firstName}</h2>
                  <p className="text-xs text-gray-500">Hostelite Account</p>
                </div>
              </div>

              <div className="space-y-2">
                <TabButton
                  active={activeTab === 'profile'}
                  onClick={() => { setActiveTab('profile'); setError(''); setSuccess(''); }}
                  icon="👤"
                  label="Profile Info"
                />
                <TabButton
                  active={activeTab === 'security'}
                  onClick={() => { setActiveTab('security'); setError(''); setSuccess(''); }}
                  icon="🔐"
                  label="Security"
                />
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="md:w-2/3">
            {activeTab === 'profile' ? (
              <div className="space-y-6">
                {!isEditing ? (
                  <div className="stat-card animate-scale-in p-8">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-xl font-bold text-aqua-800">Personal Information</h2>
                      <button onClick={() => setIsEditing(true)} className="btn-secondary py-2 px-4 text-sm">
                        Edit Profile
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
                      <ProfileField label="First Name" value={profile?.firstName} />
                      <ProfileField label="Last Name" value={profile?.lastName} />
                      <ProfileField label="Email Address" value={profile?.email} />
                      <ProfileField label="Phone Number" value={profile?.phoneNumber} />
                      <ProfileField label="University ID" value={profile?.universityId} />
                      <ProfileField label="Department" value={profile?.department} />
                      <ProfileField label="Academic Year" value={profile?.academicYear} />
                      <ProfileField label="Room Number" value={profile?.roomNumber} />
                      <ProfileField label="Hostel" value={profile?.hostel} />
                    </div>
                  </div>
                ) : (
                  <div className="stat-card animate-scale-in p-8">
                    <h2 className="text-xl font-bold text-aqua-800 mb-8">Update Profile</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputGroup label="First Name" id="firstName" name="firstName" value={formData.firstName} onChange={handleProfileChange} />
                        <InputGroup label="Last Name" id="lastName" name="lastName" value={formData.lastName} onChange={handleProfileChange} />
                      </div>
                      <InputGroup label="Phone Number" id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleProfileChange} />

                      <div className="flex gap-4 pt-4 border-t border-gray-100 mt-8">
                        <button type="submit" disabled={!hasChanges} className="btn-primary flex-1">Save Changes</button>
                        <button type="button" onClick={() => { setIsEditing(false); setHasChanges(false); setFormData({ firstName: profile?.firstName || '', lastName: profile?.lastName || '', phoneNumber: profile?.phoneNumber || '' }); }} className="btn-secondary flex-1">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="stat-card animate-scale-in p-8">
                <h2 className="text-xl font-bold text-aqua-800 mb-8">Password Management</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <InputGroup label="Current Password" id="current" name="current" type="password" value={passwords.current} onChange={handlePasswordChange} required />
                  <InputGroup label="New Password" id="new" name="new" type="password" value={passwords.new} onChange={handlePasswordChange} required />
                  <InputGroup label="Confirm New Password" id="confirm" name="confirm" type="password" value={passwords.confirm} onChange={handlePasswordChange} required />

                  <div className="pt-4 border-t border-gray-100 mt-8">
                    <button type="submit" disabled={isUpdatingPassword} className="btn-primary w-full">
                      {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${active ? 'bg-aqua-500 text-white shadow-aqua transform scale-105 z-10' : 'text-gray-600 hover:bg-aqua-50'}`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-semibold">{label}</span>
      {active && <span className="ml-auto">→</span>}
    </button>
  );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1 group">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider group-hover:text-aqua-500 transition-colors">{label}</p>
      <p className="text-gray-800 font-semibold border-b border-transparent group-hover:border-aqua-100 pb-1">{value || '-'}</p>
    </div>
  );
}

function InputGroup({ label, id, name, type = 'text', value, onChange, required = false }: { label: string; id: string; name: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold mb-2 text-gray-700 ml-1">{label}</label>
      <input id={id} name={name} type={type} value={value} onChange={onChange} required={required} className="aqua-input" />
    </div>
  );
}
