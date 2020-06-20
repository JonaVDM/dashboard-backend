import mongoose from 'mongoose';
import * as database from '../src/database';

import seeder from '../src/seeders';

import User, { IUser } from '../src/models/user';

import dotenv from 'dotenv';


async function dropDB() {
    await mongoose.connection.db.dropDatabase();
}

export async function start() {
    dotenv.config();
    await database.start();
    await seeder();
}

export async function stop() {
    await dropDB();
    await database.stop();
}

export async function getUser(name: string): Promise<IUser> {
    return User.findOne({name}).populate('role').exec();
}
