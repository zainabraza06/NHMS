'use client';

import { useState, useEffect } from 'react';
import { Challan } from '@/types';
import { billingService } from '@/services/billingService';
import { ChallanCard } from './ChallanCard';
import Link from 'next/link';
import { StripeProvider } from '@/providers/StripeProvider';

interface ChallanListProps {
    limit?: number;
    showViewAll?: boolean;
    isPaginated?: boolean;
}

export function ChallanList({ limit, showViewAll = false, isPaginated = false }: ChallanListProps) {
    const [challans, setChallans] = useState<Challan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');

    const fetchChallans = async (page: number) => {
        try {
            setIsLoading(true);
            const res = await billingService.getMyChallans(page, limit || 10, {
                status: statusFilter || undefined,
                month: monthFilter || undefined
            });
            if (res.success && res.data) {
                setChallans(res.data);
                if (res.pagination) {
                    setTotalPages(res.pagination.pages);
                    setCurrentPage(res.pagination.page);
                }
            } else {
                setError(res.message || 'Failed to fetch bills');
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || 'An error occurred while fetching bills';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChallans(1);
    }, [statusFilter, monthFilter]);

    if (isLoading && challans.length === 0) {
        return (
            <div className="flex justify-center py-12">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <StripeProvider>
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-aqua-800 flex items-center gap-3">
                        <span className="text-3xl">🧾</span> Monthly Bills
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-aqua-100 text-aqua-700 rounded-lg text-sm font-semibold">
                            {challans.length} {challans.length === 1 ? 'Challan' : 'Challans'}
                        </span>
                        <div className="flex flex-wrap items-center gap-3">
                            <input
                                type="month"
                                value={monthFilter ? `${monthFilter.split('-')[1]}-${monthFilter.split('-')[0]}` : ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (!val) { setMonthFilter(''); }
                                    else {
                                        const [y, m] = val.split('-');
                                        setMonthFilter(`${m}-${y}`);
                                    }
                                    setCurrentPage(1);
                                }}
                                className="bg-white border border-aqua-100 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-aqua-400 transition-all min-w-[140px] shadow-sm"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                className="bg-white border border-aqua-100 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-aqua-400 transition-all min-w-[130px] shadow-sm"
                            >
                                <option value="">All Statuses</option>
                                <option value="UNPAID">Unpaid</option>
                                <option value="PAID">Paid</option>
                                <option value="OVERDUE">Overdue</option>
                            </select>
                            {showViewAll && (
                                <Link
                                    href="/hostelite/bills"
                                    className="text-aqua-600 hover:text-aqua-700 text-sm font-bold flex items-center gap-1 group transition-all"
                                >
                                    View All <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className="alert-error p-4 rounded-xl border-rose-200 bg-rose-50 text-rose-700">
                        {error}
                    </div>
                ) : challans.length === 0 ? (
                    <div className="text-center py-12 px-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50">
                        <span className="text-5xl block mb-4">📜</span>
                        <p className="text-gray-500 font-medium">No bills found for your account yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {challans.map((challan) => (
                                <ChallanCard
                                    key={challan._id}
                                    challan={challan}
                                    onPaymentSuccess={() => fetchChallans(currentPage)}
                                />
                            ))}
                        </div>

                        {isPaginated && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <button
                                    onClick={() => fetchChallans(currentPage - 1)}
                                    disabled={currentPage === 1 || isLoading}
                                    className="px-4 py-2 rounded-xl border border-aqua-200 text-aqua-700 disabled:opacity-50 hover:bg-aqua-50 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-sm font-medium text-gray-500">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => fetchChallans(currentPage + 1)}
                                    disabled={currentPage === totalPages || isLoading}
                                    className="px-4 py-2 rounded-xl border border-aqua-200 text-aqua-700 disabled:opacity-50 hover:bg-aqua-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </StripeProvider>
    );
}
