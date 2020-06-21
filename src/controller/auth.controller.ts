import User from '../models/user';
import Token from '../models/token';
import strings from '../lib/strings';


import bcript from 'bcrypt';
import { RequestData } from '../../typings/request-data';
import { ResponseData } from '../../typings/response-data';

export default class AuthController {
    /**
     * The method used for loggin a user in and getting a token
     */
    public async login(data: RequestData): Promise<ResponseData> {
        const { email, password } = data.body;

        if (!email || !password) {
            return [{ message: 'Missing password or email' }, 401];
        }

        const user = await User.findOne({ email });
        let check = false;
        if (user && user.password) {
            try {
                check = await bcript.compare(password, user.password);
            } catch (e) {
                return [{ message: 'Something went wrong here, try again later' }, 500];
            }
        }

        if (!check) {
            return [{ message: 'Invalid Email/Password' }, 401];
        }

        const token = await user.generateToken(64);

        return [{ token }];
    }

    /**
     * The middleware method used for the check on the admin panel
     */
    public async auth(req: any) {
        const token = req.params.token || req.get('x-token');

        if (!token) {
            return { auth: false, error: strings.ERR_AUTH_NO_TOKEN };
        }

        const entry = await Token.findOne({ token })
            .populate({ path: 'user', populate: 'role' })
            .exec();

        if (!entry) {
            return { auth: false, error: strings.ERR_AUTH_INVALLID_TOKEN };
        }

        const date = new Date();

        if (date.getTime() - entry.date.getTime() < 86400000) {
            entry.update({ date });
            return { auth: true, user: entry.user };
        } else {
            entry.remove();
            return { auth: false, error: strings.ERR_AUTH_EXPIRED_TOKEN };
        }
    }

    /**
     * Get back the user who owns the token
     */
    public async me(data: RequestData): Promise<ResponseData> {
        if (!data.user) {
            return [{error: 'not signed in'}, 401];
        }
        return [{ user: data.user }];
    }
}
