'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLES } from '@/utils/constants';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else {
        // Redirect based on user role
        switch (user.role) {
          case USER_ROLES.HOSTELITE:
            router.push('/hostelite/dashboard');
            break;
          case USER_ROLES.CLEANING_STAFF:
            router.push('/staff/dashboard');
            break;
          case USER_ROLES.HOSTEL_MANAGER:
            router.push('/manager/dashboard');
            break;
          case USER_ROLES.ADMIN:
            router.push('/admin/dashboard');
            break;
          default:
            router.push('/login');
        }
      }
    }
  }, [user, isLoading, router]);

  // Return a loading state or nothing while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aqua-600"></div>
    </div>
  );
}
