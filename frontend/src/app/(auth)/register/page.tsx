'use client';

import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 px-4 py-8">
      <div className="w-full max-w-xl rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">Registration Disabled</h1>
        <p className="text-white/80 mb-6">
          Accounts are created by the administrator. Please use the credentials shared with you.
        </p>
        <Link href="/login" className="inline-block rounded-lg bg-primary/90 px-6 py-2 font-bold text-white hover:bg-primary">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
