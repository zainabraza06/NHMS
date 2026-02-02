'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return (
      <nav className="bg-white/10 text-white shadow-2xl backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            NHMS
          </Link>
          <div className="space-x-4">
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white/10 text-white shadow-2xl backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          NHMS
        </Link>
        <div className="flex items-center space-x-6">
          <span className="text-sm">
            {user.firstName} {user.lastName}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500/80 px-4 py-2 hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
