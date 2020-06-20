import mongoose from 'mongoose';
import 'colors';
import log from '../lib/log';

// import all models so they are loaded
import '../models/role';
import '../models/user';
import '../models/token';

const options: mongoose.ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

export async function start(): Promise<void> {

    if (!process.env.DB_HOST || !process.env.DB_NAME) {
        log('Missing values in the env file'.red);
        return;
    }

    try {
        await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME}`, options);
        log('Connected to the database'.green);
    } catch {
        log('A error occurred on the database'.red);
    }
}

export async function stop(): Promise<void> {
    await mongoose.disconnect();
    log('Disconnected from the database'.blue);
}
