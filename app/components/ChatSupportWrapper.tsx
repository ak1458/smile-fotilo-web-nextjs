'use client';

import dynamic from 'next/dynamic';

// Lazy-load ChatSupport (client-only, no SSR) to reduce initial JS bundle
const ChatSupport = dynamic(
    () => import('./ChatSupport').then((m) => m.ChatSupport),
    { ssr: false }
);

export const ChatSupportWrapper = () => {
    return <ChatSupport />;
};
