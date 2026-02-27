'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const supabase = createClient();
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
                return;
            }

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setError('Authentication succeeded but no user returned.');
                setLoading(false);
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();

            if (profile?.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/portal');
            }

            router.refresh();
        } catch {
            setError('An unexpected error occurred. Please try again.');
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium" style={{ color: '#94a3b8' }}>
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300"
                            style={{
                                background: 'rgba(139,92,246,0.08)',
                                border: '1px solid rgba(139,92,246,0.25)',
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.15)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)';
                                e.currentTarget.style.boxShadow = 'none';
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
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300"
                            style={{
                                background: 'rgba(139,92,246,0.08)',
                                border: '1px solid rgba(139,92,246,0.25)',
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.15)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)';
                                e.currentTarget.style.boxShadow = 'none';
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
                        className="relative w-full overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-400 disabled:opacity-50"
                        style={{
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                            boxShadow: '0 4px 15px -3px rgba(139,92,246,0.5)',
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                                e.currentTarget.style.boxShadow = '0 12px 35px -5px rgba(139,92,246,0.6), 0 0 20px rgba(139,92,246,0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 15px -3px rgba(139,92,246,0.5)';
                        }}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Signing in…
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-xs" style={{ color: '#64748b' }}>
                    Don&apos;t have an account?{' '}
                    <span style={{ color: '#a78bfa' }}>Contact the admin</span>
                </p>
            </div>
        </div>
    );
}
