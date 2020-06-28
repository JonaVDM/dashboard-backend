import * as server from './http';
import * as database from './database';
import cleaner from './database/cleanup';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();

let job: cron.ScheduledTask;

// Check whether it is called directly from the cli or it is imported
if (require.main === module) {
    start();

    if (env.MODE !== 'development') startCleaner();
}

export async function start() {
    await database.start();
    server.start();
}

export function stop() {
    database.stop();
    server.stop();

    if (job) {
        job.destroy();
    }
}

export function startCleaner() {
    job = cron.schedule('0 * * * *', cleaner);
}
