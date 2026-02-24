"use client";

import { useEffect, useState } from 'react';
import { FESTIVALS, Festival } from '../data/festivals';

export const FestivalProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeFestival, setActiveFestival] = useState<Festival | null>(null);

    useEffect(() => {
        const checkDate = () => {
            const today = new Date();
            // Reset time to 00:00:00 for accurate date comparison
            today.setHours(0, 0, 0, 0);

            const found = FESTIVALS.find(festival => {
                const start = new Date(festival.startDate);
                const end = new Date(festival.endDate);
                // Adjust start/end times
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);

                return today >= start && today <= end;
            });

            if (found) {
                setActiveFestival(found);
                document.documentElement.classList.add(found.themeClass);
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🎉 Happy ${found.name}! Theme activated.`);
                }
            } else {
                setActiveFestival(null);
                // Cleanup all possible themes
                FESTIVALS.forEach(f => document.documentElement.classList.remove(f.themeClass));
            }
        };

        checkDate();

        // Check every minute just in case (overkill but safe)
        const interval = setInterval(checkDate, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div
                id="festival-portal"
                className={`pointer-events-none fixed inset-0 z-[9998] transition-opacity duration-1000 ${activeFestival ? 'opacity-100' : 'opacity-0'}`}
            >
                {activeFestival?.id === 'holi' && (
                    /* Holi Ambient Effect: Subtle colorful gradient fog */
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-yellow-500/10 mix-blend-screen pointer-events-none"></div>
                )}

                {activeFestival?.id === 'diwali' && (
                    /* Diwali Ambient Effect: Subtle golden glow from bottom */
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-amber-500/10 to-transparent pointer-events-none"></div>
                )}

                {activeFestival?.id === 'dussehra' && (
                    /* Dussehra Ambient Effect: Royal orange/red tint */
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-red-500/5 pointer-events-none"></div>
                )}
            </div>
            {children}
        </>
    );
};
