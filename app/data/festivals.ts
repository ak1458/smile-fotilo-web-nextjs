export interface Festival {
    id: string;
    name: string;
    themeClass: string;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
}

// NOTE: Dates must be updated annually.
// Current configuration for 2025-2026 cycle.
export const FESTIVALS: Festival[] = [
    {
        id: 'holi',
        name: 'Holi',
        themeClass: 'theme-holi',
        startDate: '2026-03-03', // Approximate dates for 2026
        endDate: '2026-03-05',
    },
    {
        id: 'dussehra',
        name: 'Dussehra',
        themeClass: 'theme-dussehra',
        startDate: '2026-10-18',
        endDate: '2026-10-21',
    },
    {
        id: 'diwali',
        name: 'Diwali',
        themeClass: 'theme-diwali',
        startDate: '2026-11-06',
        endDate: '2026-11-11',
    },
    // Debug/Test Festival (Can be enabled for testing)
    // {
    //   id: 'test-festival',
    //   name: 'Test Festival',
    //   themeClass: 'theme-holi',
    //   startDate: '2026-01-01',
    //   endDate: '2026-12-31', 
    // }
];
