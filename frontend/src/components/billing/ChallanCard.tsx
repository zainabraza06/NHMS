'use client';

import { useState } from 'react';
import { Challan } from '@/types';
import { billingService } from '@/services/billingService';

interface ChallanCardProps {
    challan: Challan;
    onPaymentSuccess: () => void;
}

export function ChallanCard({ challan, onPaymentSuccess }: ChallanCardProps) {
    const [isPaying, setIsPaying] = useState(false);
    const [error, setError] = useState('');

    const handlePay = async () => {
        try {
            setIsPaying(true);
            setError('');

            // 1. Create Payment Intent (Mock)
            const intentRes = await billingService.createPaymentIntent(challan._id);

            if (intentRes.success) {
                // 2. Confirm Payment (Mock)
                // In a real app, this would involve Stripe Elements
                const confirmRes = await billingService.confirmPayment(
                    challan._id,
                    intentRes.data.id
                );

                if (confirmRes.success) {
                    onPaymentSuccess();
                } else {
                    setError(confirmRes.message || 'Payment confirmation failed');
                }
            } else {
                setError(intentRes.message || 'Failed to initiate payment');
            }
        } catch (err) {
            setError('An error occurred during payment');
        } finally {
            setIsPaying(false);
        }
    };

    const statusColors = {
        PAID: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        UNPAID: 'bg-amber-100 text-amber-700 border-amber-200',
        OVERDUE: 'bg-rose-100 text-rose-700 border-rose-200',
    };

    return (
        <div className="relative overflow-hidden rounded-2xl p-6 bg-white shadow-aqua border border-aqua-100/30 transition-all duration-300 hover:shadow-aqua-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{challan.month}</h3>
                    <p className="text-sm text-gray-500">Due Date: {new Date(challan.dueDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[challan.status]}`}>
                    {challan.status}
                </span>
            </div>

            <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Base Mess Fee</span>
                    <span className="font-medium">PKR {challan.baseMessFee}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Mess Off Discount</span>
                    <span className="font-medium text-emerald-600">-PKR {challan.messOffDiscount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Penalty</span>
                    <span className="font-medium text-rose-600">+PKR {challan.penalty}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <span className="font-bold text-aqua-600 text-lg">PKR {challan.totalAmount}</span>
                </div>
            </div>

            {error && <p className="text-rose-500 text-xs mb-3">{error}</p>}

            {challan.status !== 'PAID' && (
                <button
                    onClick={handlePay}
                    disabled={isPaying}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-aqua-600 to-indigo-600 text-white font-bold shadow-aqua-lg hover:shadow-aqua-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPaying ? (
                        <span className="flex items-center justify-center">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                            Processing...
                        </span>
                    ) : (
                        'Pay Now'
                    )}
                </button>
            )}

            {challan.status === 'PAID' && challan.paidAt && (
                <p className="text-center text-emerald-600 text-sm font-medium">
                    Paid on {new Date(challan.paidAt).toLocaleDateString()}
                </p>
            )}
        </div>
    );
}
