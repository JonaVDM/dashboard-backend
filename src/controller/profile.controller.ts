import Controller from './controller';
import User from '../models/user';

import { RequestData } from '../../typings/request-data';
import { ResponseData } from '../../typings/response-data';

export default class ProfileController extends Controller {
    async all(data: RequestData): Promise<ResponseData> {
        if (!this.can(data, 'profile.discover')) {
            return this.unauthorized;
        }

        try {
            const users = await User.find({}, 'name role')
                .populate('role', 'role')
                .exec();
            return [{ users }];
        } catch (e) {
            return [{ error: e }]
        }
    }

    async me(data: RequestData): Promise<ResponseData> {
        const user = data.user;
        // TODO: Remove password
        return [{ user }];
    }

    async single(data: RequestData): Promise<ResponseData> {
        if (data.params.name == data.user.name) {
            return [{ user: data.user }];
        }

        if (!this.can(data, 'profile.discover')) {
            return this.unauthorized;
        }

        try {
            const user = await User.findOne({ name: data.params.name }, 'name role')
                .populate('role', 'role')
                .exec();
            return [{ user }];
        } catch (e) {
            return [{ error: e }]
        }
    }

    async edit(data: RequestData): Promise<ResponseData> {
        const { email, password } = data.body;

        const update: {email?: string, password?: string} = {};
        if (email) update.email = email;
        if (password) update.password = password;

        try {
            await User.updateOne({name: data.user.name}, update, {
                runValidators: true,
                context: 'query'
            });

            return [{ updated: true }];
        } catch (e) {
            return [{ updated: false, errors: e.errors }, 400];
        }
    }
}
