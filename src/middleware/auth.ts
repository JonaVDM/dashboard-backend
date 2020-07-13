import { RequestData } from '../../typings/request-data';
import Token from '../models/token';
import User from '../models/user';

/**
 * The middleware for checking the token and adding the user to the
 */
export default async function auth(req: any, data: RequestData): Promise<RequestData> {
    const token = req.get('x-token');

    if (!token) {
        return data;
    }

    if (process.env.MODE == 'development' && token == 'dev') {
        const user = await User.findOne({ email: 'developer@mail.com' }).populate('role');
        return Object.assign({}, data, { user });
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
