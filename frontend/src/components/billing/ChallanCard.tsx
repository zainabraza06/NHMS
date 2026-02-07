'use client';

import { useState } from 'react';
import { Challan } from '@/types';
import { billingService } from '@/services/billingService';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

interface ChallanCardProps {
    challan: Challan;
    onPaymentSuccess: () => void;
}

export function ChallanCard({ challan, onPaymentSuccess }: ChallanCardProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isPaying, setIsPaying] = useState(false);
    const [showCardInput, setShowCardInput] = useState(false);
    const [error, setError] = useState('');
    const [paymentIntent, setPaymentIntent] = useState<any>(null);

    const startPayment = async () => {
        try {
            setIsPaying(true);
            setError('');

            // 1. Create Payment Intent on backend
            const intentRes = await billingService.createPaymentIntent(challan._id);

            if (intentRes.success) {
                setPaymentIntent(intentRes.data);
                setShowCardInput(true);
            } else {
                setError(intentRes.message || 'Failed to initiate payment');
            }
        } catch (err) {
            setError('An error occurred during payment initiation');
        } finally {
            setIsPaying(false);
        }
    };

    const handleConfirmPayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements || !paymentIntent) {
            return;
        }

        try {
            setIsPaying(true);
            setError('');

            const cardElement = elements.getElement(CardElement);
            if (!cardElement) return;

            // 2. Confirm payment with Stripe
            const { error: stripeError, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
                paymentIntent.client_secret,
                {
                    payment_method: {
                        card: cardElement,
                    },
                }
            );

            if (stripeError) {
                setError(stripeError.message || 'Payment failed');
            } else if (confirmedIntent && confirmedIntent.status === 'succeeded') {
                // 3. Confirm on backend to update database
                const confirmRes = await billingService.confirmPayment(
                    challan._id,
                    confirmedIntent.id
                );

                if (confirmRes.success) {
                    onPaymentSuccess();
                    setShowCardInput(false);
                } else {
                    setError(confirmRes.message || 'Payment confirmed by Stripe but failed to update backend');
                }
            }
        } catch (err) {
            setError('An error occurred during payment confirmation');
        } finally {
            setIsPaying(false);
        }
    };

    const statusColors = {
        PAID: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        UNPAID: 'bg-amber-100 text-amber-700 border-amber-200',
        OVERDUE: 'bg-rose-100 text-rose-700 border-rose-200',
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#1e293b',
                '::placeholder': {
                    color: '#94a3b8',
                },
            },
            invalid: {
                color: '#e11d48',
            },
        },
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

            {!showCardInput && challan.status !== 'PAID' && (
                <button
                    onClick={startPayment}
                    disabled={isPaying || !stripe}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-aqua-600 to-indigo-600 text-white font-bold shadow-aqua-lg hover:shadow-aqua-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPaying ? (
                        <span className="flex items-center justify-center">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                            Initializing...
                        </span>
                    ) : (
                        'Pay Now'
                    )}
                </button>
            )}

            {showCardInput && (
                <form onSubmit={handleConfirmPayment} className="space-y-4 animate-slide-up">
                    <div className="p-3 rounded-xl border border-gray-200 bg-gray-50">
                        <CardElement options={cardElementOptions} />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setShowCardInput(false)}
                            className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPaying}
                            className="flex-[2] py-2 rounded-xl bg-aqua-600 text-white font-bold shadow-aqua-sm hover:shadow-aqua hover:bg-aqua-700 transition-all disabled:opacity-50"
                        >
                            {isPaying ? 'Processing...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            )}

            {challan.status === 'PAID' && challan.paidAt && (
                <p className="text-center text-emerald-600 text-sm font-medium">
                    Paid on {new Date(challan.paidAt).toLocaleDateString()}
                </p>
            )}
        </div>
    );
}
