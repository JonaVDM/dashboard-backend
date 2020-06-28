import User from '../models/user';
import Token from '../models/token';

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
            return [{ message: 'api.auth.missing' }, 400];
        }

        const user = await User.findOne({ email });
        let check = false;
        if (user && user.password) {
            try {
                check = await bcript.compare(password, user.password);
            } catch (e) {
                return [{ message: 'api.something.went.wrong' }, 500];
            }
        }

        if (!check) {
            return [{ message: 'api.auth.invalid' }, 401];
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
            return { auth: false };
        }

        const entry = await Token.findOne({ token })
            .populate({ path: 'user', populate: 'role' })
            .exec();

        if (!entry) {
            return { auth: false };
        }

        const valid = await entry.isValid();


        if (valid) {
            return { auth: true, user: entry.user };
        } else {
            return { auth: false };
        }
    }

    /**
     * Get back the user who owns the token
     */
    public async me(data: RequestData): Promise<ResponseData> {
        if (!data.user) {
            return [{ error: 'api.not.signed.in' }, 401];
        }
        return [{ user: data.user }];
    }
}
