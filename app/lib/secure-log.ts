/**
 * Secure Logger Utility
 * Ensures sensitive errors are not exposed in production client consoles
 * while still allowing server-side logging for debugging.
 */

export const secureLog = {
    error: (message: string, error?: unknown) => {
        // In production browser environments, we suppress or sanitize
        if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
            // Optionally send to a real error tracking service (Sentry, Datadog) here
            // For now, we just suppress internal details from the client console
            console.error(`[SmileFotilo] ${message} (Details hidden in production)`);
            return;
        }

        // Server-side or development environment: log fully
        if (error) {
            console.error(`[Error] ${message}:`, error);
        } else {
            console.error(`[Error] ${message}`);
        }
    },

    warn: (message: string, data?: unknown) => {
        if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') return;
        if (data) console.warn(`[Warn] ${message}:`, data);
        else console.warn(`[Warn] ${message}`);
    },

    info: (message: string, data?: unknown) => {
        if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') return;
        if (data) console.info(`[Info] ${message}:`, data);
        else console.info(`[Info] ${message}`);
    }
};
