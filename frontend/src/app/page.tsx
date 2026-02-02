'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLES } from '@/utils/constants';

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center text-white bg-white/10 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl p-10 max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">
            NUST Hostel Management System
          </h1>
          <p className="text-xl mb-8">
            Manage hostel operations efficiently
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="bg-white/20 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/30"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-primary/80 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        Welcome, {user.firstName}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {user.role === USER_ROLES.HOSTELITE && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
              <Link
                href="/hostelite/dashboard"
                className="text-blue-600 hover:underline"
              >
                View Dashboard →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">My Requests</h2>
              <Link
                href="/hostelite/requests"
                className="text-blue-600 hover:underline"
              >
                View Requests →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Profile</h2>
              <Link
                href="/hostelite/profile"
                className="text-blue-600 hover:underline"
              >
                Edit Profile →
              </Link>
            </div>
          </>
        )}

        {user.role === USER_ROLES.CLEANING_STAFF && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
              <Link
                href="/staff/dashboard"
                className="text-blue-600 hover:underline"
              >
                View Dashboard →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
              <Link
                href="/staff/tasks"
                className="text-blue-600 hover:underline"
              >
                View Tasks →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Profile</h2>
              <Link
                href="/staff/profile"
                className="text-blue-600 hover:underline"
              >
                Edit Profile →
              </Link>
            </div>
          </>
        )}

        {user.role === USER_ROLES.HOSTEL_MANAGER && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
              <Link
                href="/manager/dashboard"
                className="text-blue-600 hover:underline"
              >
                View Dashboard →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Requests</h2>
              <Link
                href="/manager/requests"
                className="text-blue-600 hover:underline"
              >
                Manage Requests →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Hostelites</h2>
              <Link
                href="/manager/hostelites"
                className="text-blue-600 hover:underline"
              >
                View Hostelites →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Staff</h2>
              <Link
                href="/manager/staff"
                className="text-blue-600 hover:underline"
              >
                Manage Staff →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Profile</h2>
              <Link
                href="/manager/profile"
                className="text-blue-600 hover:underline"
              >
                Edit Profile →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
