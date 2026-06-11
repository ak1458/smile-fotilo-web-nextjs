'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'sf_cookie_consent';

type ConsentChoice = 'granted' | 'denied';

declare global {
    interface Window {
        dataLayer?: unknown[];
    }
}

function pushConsentUpdate(choice: ConsentChoice) {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
        window.dataLayer!.push(args);
    }
    gtag('consent', 'update', {
        analytics_storage: choice,
        ad_storage: choice,
        ad_user_data: choice,
        ad_personalization: choice,
    });
}

export function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
        } catch {
            // storage blocked: keep banner hidden rather than nag every visit
        }
    }, []);

    const decide = (choice: ConsentChoice) => {
        try {
            localStorage.setItem(STORAGE_KEY, choice);
            // Mirror in a cookie so server-side code could read it later.
            document.cookie = `${STORAGE_KEY}=${choice}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
        } catch {
            // storage failure shouldn't block the choice taking effect this session
        }
        pushConsentUpdate(choice);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label="Cookie consent"
            className="fixed inset-x-3 bottom-20 z-[110] md:inset-x-auto md:bottom-6 md:right-6 md:max-w-md"
        >
            <div className="rounded-2xl border border-white/10 bg-[#0b1020]/95 p-5 shadow-2xl backdrop-blur-xl">
                <h2 className="text-sm font-bold text-white">Cookies &amp; analytics</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    I use Google Analytics to understand which pages help visitors. Nothing is
                    tracked until you choose. Details in the{' '}
                    <Link href="/cookie-policy" className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200">
                        cookie policy
                    </Link>
                    .
                </p>
                <div className="mt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={() => decide('granted')}
                        className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
                    >
                        Accept all
                    </button>
                    <button
                        type="button"
                        onClick={() => decide('denied')}
                        className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5"
                    >
                        Necessary only
                    </button>
                </div>
            </div>
        </div>
    );
}
