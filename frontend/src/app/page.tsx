'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLES } from '@/utils/constants';

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-aqua-100/30 rounded-full blur-[100px] animate-pulse-soft"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-aqua-200/20 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }}></div>

        <div className="text-center z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aqua-50 border border-aqua-100 text-aqua-700 text-xs font-black uppercase tracking-widest mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aqua-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-aqua-500"></span>
            </span>
            Modern Hostel Management
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter animate-slide-up">
            <span className="bg-gradient-to-r from-aqua-600 via-aqua-800 to-aqua-900 bg-clip-text text-transparent">NUST</span>
            <br />
            <span className="text-gray-900">Hostel Ecosystem</span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-gray-500 max-w-2xl mx-auto leading-relaxed animate-slide-up stagger-1">
            Experience the next generation of hostel living with our seamless,
            automated, and visually stunning management platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
            <Link
              href="/login"
              className="btn-primary text-xl px-12 py-4 shadow-aqua-lg w-full sm:w-auto"
            >
              Enter Dashboard
            </Link>
            <div className="text-gray-400 font-bold hidden sm:block mx-4">or</div>
            <a
              href="#features"
              className="btn-secondary text-xl px-12 py-4 w-full sm:w-auto"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Feature Teasers */}
        <div id="features" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full animate-fade-in stagger-3">
          <FeatureTeaser
            icon="⚡"
            title="Instant Requests"
            description="Submit leave or cleaning requests in seconds with real-time updates."
          />
          <FeatureTeaser
            icon="🧹"
            title="Smart Staffing"
            description="Efficient task allocation for staff with automated status tracking."
          />
          <FeatureTeaser
            icon="📊"
            title="Deep Insights"
            description="Manager dashboards with full visibility over hostel operations."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container mt-12">
      <div className="mb-12 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
          Welcome back, <span className="text-aqua-600 font-black italic">{user.firstName}</span>! 👋
        </h1>
        <p className="text-gray-500 text-lg">Where would you like to go today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {user.role === USER_ROLES.HOSTELITE && (
          <>
            <MainActionCard title="My Dashboard" description="Check stats and recent activity" href="/hostelite/dashboard" icon="📊" color="aqua" delay="stagger-1" />
            <MainActionCard title="Submit Request" description="New leave, cleaning or mess-off" href="/hostelite/requests/new" icon="➕" color="emerald" delay="stagger-2" />
            <MainActionCard title="My Requests" description="Track your submitted applications" href="/hostelite/requests" icon="📋" color="blue" delay="stagger-3" />
          </>
        )}

        {user.role === USER_ROLES.CLEANING_STAFF && (
          <>
            <MainActionCard title="My Dashboard" description="Overview of your tasks" href="/staff/dashboard" icon="📊" color="emerald" delay="stagger-1" />
            <MainActionCard title="Cleaning Tasks" description="View and update your assignments" href="/staff/tasks" icon="🧹" color="aqua" delay="stagger-2" />
            <MainActionCard title="Profile" description="Manage your personal info" href="/staff/profile" icon="👤" color="blue" delay="stagger-3" />
          </>
        )}

        {user.role === USER_ROLES.HOSTEL_MANAGER && (
          <>
            <MainActionCard title="Admin Dashboard" description="Full hostel stats & control" href="/manager/dashboard" icon="🏛️" color="purple" delay="stagger-1" />
            <MainActionCard title="Hostelites" description="Manage all registered students" href="/manager/hostelites" icon="👥" color="blue" delay="stagger-2" />
            <MainActionCard title="Staff Management" description="Coordinate cleaning operations" href="/manager/staff" icon="🧹" color="aqua" delay="stagger-3" />
            <MainActionCard title="Requests" description="Approve or reject student requests" href="/manager/requests" icon="📋" color="indigo" delay="stagger-4" />
          </>
        )}
      </div>
    </div>
  );
}

function FeatureTeaser({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/50 border border-aqua-100 hover:border-aqua-300 transition-all duration-300 hover:shadow-aqua group">
      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function MainActionCard({ title, description, href, icon, color, delay }: { title: string; description: string; href: string; icon: string; color: string; delay: string }) {
  const colorMap: Record<string, string> = {
    aqua: 'from-aqua-400 to-aqua-600',
    emerald: 'from-emerald-400 to-emerald-600',
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    indigo: 'from-indigo-400 to-indigo-600',
  };

  return (
    <Link
      href={href}
      className={`glass-card p-8 group animate-slide-up ${delay} border-2 border-transparent hover:border-aqua-200`}
    >
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white text-3xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-aqua-700 transition-colors uppercase tracking-tighter">
        {title}
      </h3>
      <p className="text-gray-500 mb-6 font-medium">
        {description}
      </p>
      <div className="flex items-center text-aqua-600 font-black uppercase text-xs tracking-widest group-hover:translate-x-2 transition-transform">
        Open Module <span className="ml-2">→</span>
      </div>
    </Link>
  );
}
