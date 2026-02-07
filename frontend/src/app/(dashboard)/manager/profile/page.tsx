'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { USER_ROLES } from '@/utils/constants';

interface ManagerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  managerId?: string;
  hostel?: string;
  joinDate?: string;
}

export default function ManagerProfilePage() {
  const { user: authUser, updateUser } = useAuth();
  const [profile, setProfile] = useState<ManagerProfile | null>(null);
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
        const response = await userService.getManagerProfile();
        if (response.success && response.data) {
          const profileData: ManagerProfile = {
            id: response.data._id || response.data.id || '',
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            managerId: response.data.managerId,
            hostel: typeof response.data.hostel === 'string' ? response.data.hostel : response.data.hostel?.name,
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
      const response = await userService.updateManagerProfile(formData);
      if (response.success) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        setHasChanges(false);
        if (profile) {
          setProfile({ ...profile, ...formData });
        }
        updateUser(formData);
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
      <ProtectedRoute allowedRoles={[USER_ROLES.HOSTEL_MANAGER]}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="spinner"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.HOSTEL_MANAGER]}>
      <div className="page-container max-w-4xl">
        <h1 className="section-header">Account Settings</h1>

        {error && <div className="alert-error mb-6">{error}</div>}
        {success && <div className="alert-success mb-6">{success}</div>}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="md:w-1/3">
            <div className="stat-card p-4 sticky top-8">
              <div className="flex items-center gap-4 mb-8 p-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">{profile?.firstName}</h2>
                  <p className="text-xs text-gray-500">Manager Account</p>
                </div>
              </div>

              <div className="space-y-2">
                <TabButton
                  active={activeTab === 'profile'}
                  onClick={() => { setActiveTab('profile'); setError(''); setSuccess(''); }}
                  icon="👤"
                  label="Profile Info"
                  activeColor="bg-purple-600"
                  hoverColor="hover:bg-purple-50"
                />
                <TabButton
                  active={activeTab === 'security'}
                  onClick={() => { setActiveTab('security'); setError(''); setSuccess(''); }}
                  icon="🔐"
                  label="Security"
                  activeColor="bg-purple-600"
                  hoverColor="hover:bg-purple-50"
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
                      <h2 className="text-xl font-bold text-purple-800">Manager Information</h2>
                      <button onClick={() => setIsEditing(true)} className="btn-secondary py-2 px-4 text-sm border-purple-200 text-purple-700 hover:bg-purple-50">
                        Edit Profile
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
                      <ProfileField label="First Name" value={profile?.firstName} accent="purple" />
                      <ProfileField label="Last Name" value={profile?.lastName} accent="purple" />
                      <ProfileField label="Email Address" value={profile?.email} accent="purple" />
                      <ProfileField label="Phone Number" value={profile?.phoneNumber} accent="purple" />
                      <ProfileField label="Manager ID" value={profile?.managerId} accent="purple" />
                      <ProfileField label="Hostel" value={profile?.hostel} accent="purple" />
                      <ProfileField label="Join Date" value={profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : '-'} accent="purple" />
                    </div>
                  </div>
                ) : (
                  <div className="stat-card animate-scale-in p-8">
                    <h2 className="text-xl font-bold text-purple-800 mb-8">Update Profile</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputGroup label="First Name" id="firstName" name="firstName" value={formData.firstName} onChange={handleProfileChange} focusColor="focus:border-purple-400 focus:ring-purple-100" />
                        <InputGroup label="Last Name" id="lastName" name="lastName" value={formData.lastName} onChange={handleProfileChange} focusColor="focus:border-purple-400 focus:ring-purple-100" />
                      </div>
                      <InputGroup label="Phone Number" id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleProfileChange} focusColor="focus:border-purple-400 focus:ring-purple-100" />

                      <div className="flex gap-4 pt-4 border-t border-gray-100 mt-8">
                        <button type="submit" disabled={!hasChanges} className="btn-primary bg-gradient-to-r from-purple-500 to-purple-600 flex-1 border-none shadow-lg hover:from-purple-600 hover:to-purple-700">Save Changes</button>
                        <button type="button" onClick={() => { setIsEditing(false); setHasChanges(false); setFormData({ firstName: profile?.firstName || '', lastName: profile?.lastName || '', phoneNumber: profile?.phoneNumber || '' }); }} className="btn-secondary flex-1 border-purple-200 text-purple-700">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="stat-card animate-scale-in p-8">
                <h2 className="text-xl font-bold text-purple-800 mb-8">Security & Privacy</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <InputGroup label="Current Password" id="current" name="current" type="password" value={passwords.current} onChange={handlePasswordChange} required focusColor="focus:border-purple-400 focus:ring-purple-100" />
                  <InputGroup label="New Password" id="new" name="new" type="password" value={passwords.new} onChange={handlePasswordChange} required focusColor="focus:border-purple-400 focus:ring-purple-100" />
                  <InputGroup label="Confirm New Password" id="confirm" name="confirm" type="password" value={passwords.confirm} onChange={handlePasswordChange} required focusColor="focus:border-purple-400 focus:ring-purple-100" />

                  <div className="pt-4 border-t border-gray-100 mt-8">
                    <button type="submit" disabled={isUpdatingPassword} className="btn-primary w-full bg-gradient-to-r from-purple-500 to-purple-600 border-none shadow-lg hover:from-purple-600 hover:to-purple-700">
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

function TabButton({ active, onClick, icon, label, activeColor = 'bg-aqua-500', hoverColor = 'hover:bg-aqua-50' }: { active: boolean; onClick: () => void; icon: string; label: string; activeColor?: string; hoverColor?: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${active ? `${activeColor} text-white shadow-lg transform scale-105 z-10` : `text-gray-600 ${hoverColor}`}`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-semibold">{label}</span>
      {active && <span className="ml-auto">→</span>}
    </button>
  );
}

function ProfileField({ label, value, accent = 'aqua' }: { label: string; value?: string; accent?: string }) {
  const accentColor = accent === 'purple' ? 'group-hover:text-purple-500' : 'group-hover:text-aqua-500';
  const borderAccent = accent === 'purple' ? 'group-hover:border-purple-100' : 'group-hover:border-aqua-100';

  return (
    <div className="space-y-1 group">
      <p className={`text-gray-400 text-xs font-bold uppercase tracking-wider ${accentColor} transition-colors`}>{label}</p>
      <p className={`text-gray-800 font-semibold border-b border-transparent ${borderAccent} pb-1`}>{value || '-'}</p>
    </div>
  );
}

function InputGroup({ label, id, name, type = 'text', value, onChange, required = false, focusColor = 'focus:border-aqua-500 focus:ring-aqua-100' }: { label: string; id: string; name: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; focusColor?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold mb-2 text-gray-700 ml-1">{label}</label>
      <input id={id} name={name} type={type} value={value} onChange={onChange} required={required} className={`aqua-input ${focusColor}`} />
    </div>
  );
}
