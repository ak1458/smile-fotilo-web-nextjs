'use client';

import { ChatSupport } from './ChatSupport';
import { ErrorBoundary } from './ErrorBoundary';

export const ChatSupportWrapper = () => {
    return (
        <ErrorBoundary>
            <ChatSupport />
        </ErrorBoundary>
    );
};
