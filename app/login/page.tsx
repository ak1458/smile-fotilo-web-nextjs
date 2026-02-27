'use client';

import { useState } from 'react';
import { signInAction, type SignInResult } from '@/app/actions/auth';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setError(null);
        setLoading(true);

        try {
            const result: SignInResult = await signInAction(formData);
            // If we reach here, there was an error (successful login redirects)
            if (result?.error) {
                setError(result.error);
            }
        } catch (err: unknown) {
            // redirect() throws a NEXT_REDIRECT error — that's expected
            // Only show error for actual failures
            if (err instanceof Error && !err.message.includes('NEXT_REDIRECT')) {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #1a0a2e 50%, #0f0720 100%)' }}>
            {/* Ambient glow effects */}
            <div
                className="pointer-events-none fixed inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at 30% 30%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(59,130,246,0.10) 0%, transparent 50%)',
                }}
            />

            <div
                className="relative z-10 w-full max-w-md space-y-8 rounded-3xl p-8 sm:p-10"
                style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.08) 100%)',
                    backdropFilter: 'blur(24px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    boxShadow: '0 8px 32px -4px rgba(139,92,246,0.2)',
                }}
            >
                {/* Header */}
                <div className="text-center">
                    <div
                        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                            boxShadow: '0 0 30px rgba(139,92,246,0.4)',
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                    <p className="mt-2 text-sm" style={{ color: '#94a3b8' }}>
                        Sign in to your admin console or client portal
                    </p>
                </div>

                {/* Form — uses server action */}
                <form action={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium" style={{ color: '#94a3b8' }}>
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-violet-500/50"
                            style={{
                                background: 'rgba(139,92,246,0.08)',
                                border: '1px solid rgba(139,92,246,0.25)',
                            }}
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-sm font-medium" style={{ color: '#94a3b8' }}>
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-violet-500/50"
                            style={{
                                background: 'rgba(139,92,246,0.08)',
                                border: '1px solid rgba(139,92,246,0.25)',
                            }}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div
                            className="rounded-xl px-4 py-3 text-sm"
                            style={{
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                color: '#fca5a5',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <span>Signing in…</span>
                            </span>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-xs" style={{ color: '#64748b' }}>
                    Don&apos;t have an account or forgot your password?{' '}
                    <a href="mailto:admin@smilefotilo.com" className="hover:underline transition-all" style={{ color: '#a78bfa' }}>
                        Contact the admin
                    </a>
                </p>
            </div>
        </div>
    );
}
