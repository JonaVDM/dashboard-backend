import { RequestData } from '../../typings/request-data';
import Token from '../models/token';

/**
 * The middleware for checking the token and adding the user to the
 */
export default async function auth(req: any, data: RequestData): Promise<RequestData> {
    const token = req.get('x-token');

    if (!token) {
        return data;
    }

    const entry = await Token.findOne({ token })
        .populate({ path: 'user', populate: 'role' })
        .exec();

    if (!entry) {
        return data;
    }

    const valid = await entry.isValid();


    if (valid) {
        return Object.assign({}, data, { user: entry.user });
    } else {
        return data;
    }
}
