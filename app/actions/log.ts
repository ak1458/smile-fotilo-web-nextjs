'use server';

import fs from 'fs/promises';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'missing_knowledge_log.json');

export async function logMissingKnowledge(query: string) {
    const timestamp = new Date().toISOString();
    const entry = { timestamp, query };

    try {
        let logs = [];
        try {
            const data = await fs.readFile(LOG_FILE, 'utf-8');
            logs = JSON.parse(data);
        } catch (error) {
            // File might not exist yet
        }

        logs.push(entry);
        await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2));
        return { success: true };
    } catch (error) {
        console.error("Failed to log missing knowledge:", error);
        return { success: false };
    }
}
