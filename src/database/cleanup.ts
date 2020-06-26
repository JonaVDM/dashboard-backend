import Token from '../models/token';
import log from '../lib/log';

export default async function (): Promise<void> {
    log('Executed cleaner');

    const tokens = await Token.find({});

    for (const token of tokens) {
        await token.isValid();
    }
}
