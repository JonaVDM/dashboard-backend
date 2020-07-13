//
// WARNING
//
// Executing this seeder file will empty the database
// DO NOT EXECUTE ON PRODUCTION
// All data will be lost unless you have a backup
//

// Import the .env file
import dotenv from 'dotenv';

// Import the connection
import * as database from '../database';
import mongoose from 'mongoose';

// Import seeds
import roles from './roles';
import users from './users';

dotenv.config();

// Check whether it is called directly from the cli or it is imported
if (require.main === module) {
    start();
}

async function start() {
    // start the connection with the database
    await database.start();

    await main();

    // stop the connection with the database
    await database.stop();
}

export default async function main() {
    // Drop the database
    // Again do not execute the seeder on production
    await mongoose.connection.db.dropDatabase();

    // execute the seeders
    const roleList = await roles();
    await users(roleList);
}
