'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLES } from '@/utils/constants';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: USER_ROLES.HOSTELITE,
    universityId: '',
    department: '',
    academicYear: '',
    roomNumber: '',
    hostelId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const registerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        ...(formData.role === USER_ROLES.HOSTELITE && {
          universityId: formData.universityId,
          department: formData.department,
          academicYear: formData.academicYear,
          roomNumber: formData.roomNumber,
          hostelId: formData.hostelId,
        }),
      };

      const result = await register(registerData);
      if (result.success) {
        setSuccess('Registration successful! Please check your email to verify your account.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Register</h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-emerald-100">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-white/80">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-white/80">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-white/80">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-primary/70"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1 text-white/80">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-primary/70"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-white/80">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-white/80">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1 text-white/80">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-primary/70"
            >
              <option value={USER_ROLES.HOSTELITE}>Hostelite (Student)</option>
              <option value={USER_ROLES.CLEANING_STAFF}>Cleaning Staff</option>
              <option value={USER_ROLES.HOSTEL_MANAGER}>Hostel Manager</option>
            </select>
          </div>

          {formData.role === USER_ROLES.HOSTELITE && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="universityId" className="block text-sm font-medium mb-1 text-white/80">
                    University ID
                  </label>
                  <input
                    id="universityId"
                    type="text"
                    name="universityId"
                    value={formData.universityId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-primary/70"
                  />
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium mb-1 text-white/80">
                    Department
                  </label>
                  <input
                    id="department"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-primary/70"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="academicYear" className="block text-sm font-medium mb-1 text-white/80">
                    Academic Year
                  </label>
                  <input
                    id="academicYear"
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-primary/70"
                  />
                </div>
                <div>
                  <label htmlFor="roomNumber" className="block text-sm font-medium mb-1 text-white/80">
                    Room Number
                  </label>
                  <input
                    id="roomNumber"
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-primary/70"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="hostelId" className="block text-sm font-medium mb-1 text-white/80">
                  Hostel ID
                </label>
                <input
                  id="hostelId"
                  type="text"
                  name="hostelId"
                  value={formData.hostelId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-primary/70"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary/90 py-2 font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary disabled:bg-white/20"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-white hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
