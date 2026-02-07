'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = user ? [
    { name: 'Dashboard', href: `/${user.role.toLowerCase().split('_')[0]}/dashboard` },
    { name: 'Profile', href: `/${user.role.toLowerCase().split('_')[0]}/profile` },
  ] : [];

  return (
    <nav className="navbar sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <Link
          href="/"
          className="group flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aqua-400 to-aqua-600 flex items-center justify-center text-white font-bold shadow-aqua transition-transform group-hover:scale-110 group-active:scale-95">
            N
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-aqua-700 to-aqua-900 bg-clip-text text-transparent group-hover:from-aqua-600 group-hover:to-aqua-800 transition-all duration-300">
            NHMS
          </span>
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${pathname === link.href
                    ? 'bg-aqua-50 text-aqua-700'
                    : 'text-gray-600 hover:text-aqua-600 hover:bg-aqua-50/50'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {!user ? (
            <Link
              href="/login"
              className="btn-primary px-6 py-2 text-sm shadow-md"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-4 border-l border-gray-100 pl-4 md:pl-8">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-800 leading-none">
                  {user.firstName}
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-tighter font-black mt-1">
                  {user.role.replace('_', ' ')}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-rose-200"
                title="Logout"
              >
                <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
