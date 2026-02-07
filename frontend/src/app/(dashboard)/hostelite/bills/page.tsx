'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { USER_ROLES } from '@/utils/constants';
import { ChallanList } from '@/components/billing/ChallanList';
import Link from 'next/link';

export default function HosteliteBillsPage() {
    return (
        <ProtectedRoute allowedRoles={[USER_ROLES.HOSTELITE]}>
            <div className="page-container">
                {/* Navigation Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/hostelite/dashboard" className="hover:text-aqua-600 transition-colors">Dashboard</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium">My Bills</span>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-aqua-600 to-indigo-600 bg-clip-text text-transparent">
                        Bill History
                    </h1>
                    <p className="text-gray-500">View and manage all your monthly hostel and mess bills.</p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white shadow-aqua-sm">
                    <ChallanList limit={9} isPaginated={true} />
                </div>
            </div>
        </ProtectedRoute>
    );
}
