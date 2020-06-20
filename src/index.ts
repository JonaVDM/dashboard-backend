if (process.env.MODE == 'production') {
    require('module-alias/register');
}

import * as server from './http';
import * as database from './database';

import dotenv from 'dotenv';

dotenv.config();

// Check whether it is called directly from the cli or it is imported
if (require.main === module) {
    start();
}

export async function start() {
    await database.start();
    server.start();
}

export function stop() {
    database.stop();
    server.stop();
}
