'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ReactNode } from 'react';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

interface StripeProviderProps {
    children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
    if (!stripePublishableKey || stripePublishableKey === 'pk_test_mock_key') {
        return (
            <div className="p-4 border border-yellow-500 bg-yellow-100/10 text-yellow-500 rounded-lg">
                <p className="font-bold">Stripe Key Missing</p>
                <p className="text-sm">Please set <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> in your <code>.env</code> file to enable payments.</p>
                {children}
            </div>
        );
    }

    const stripePromise = loadStripe(stripePublishableKey);

    return (
        <Elements stripe={stripePromise}>
            {children}
        </Elements>
    );
}
