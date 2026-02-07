'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({ email, password });
      if (result.success && result.user) {
        // Redirect based on user role
        const role = result.user.role;
        if (role === 'HOSTELITE') {
          router.push('/hostelite/dashboard');
        } else if (role === 'CLEANING_STAFF') {
          router.push('/staff/dashboard');
        } else if (role === 'HOSTEL_MANAGER') {
          router.push('/manager/dashboard');
        } else {
          router.push('/');
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-card p-8 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-aqua-400 to-aqua-600 mb-4 shadow-aqua animate-float">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-aqua-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {(error || authError) && (
          <div className="alert-error mb-6">
            {error || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="animate-slide-up stagger-1">
            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="aqua-input"
              placeholder="user@example.com"
            />
          </div>

          <div className="animate-slide-up stagger-2">
            <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="aqua-input"
              placeholder="••••••••"
            />
          </div>

          <div className="animate-slide-up stagger-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center animate-fade-in">
          <p className="text-gray-500 text-sm">
            Credentials are provided by the administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
