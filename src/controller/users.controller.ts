import User from '../models/user';
import Controller from './controller';
import { RequestData } from '../../typings/request-data';

import Role from '../models/role';

export default class UsersController extends Controller {

    /**
     * Get a list with all the users
     */
    public async all(data: RequestData) {
        if (!this.can(data, 'user.read')) {
            return this.unauthorized;
        }

        const users = await User
            .find({}, 'name email')
            .populate('role', 'name')
            .exec();

        return [{ users }];
    }

    /**
     * Get a single user
     */
    public async single(data: RequestData) {
        if (!this.can(data, 'user.read')) {
            return this.unauthorized;
        }

        const name = data.params.user;

        const user = await User.findOne({ name })
            .populate('role', 'name')
            .exec();

        return [{ user }];
    }

    /**
     * Delete a user
     * Requires the username in the request url under user
     */
    public async delete(data: RequestData) {
        if (!this.can(data, 'user.delete')) {
            return this.unauthorized;
        }

        const name = data.params.user;

        const result = await User.deleteOne({ name });

        return [{ 'deleted': !!result.deletedCount }];
    }

    /**
     * Edit a single user
     * Requires the username in the request under user
     * Expects the users new data in the body
     */
    public async edit(data: RequestData) {
        if (!this.can(data, 'user.update')) {
            return this.unauthorized;
        }

        const name = data.params.user;
        const update = data.body;

        if (update.role) {
            update.role = await Role.findOne({ role: update.role });
        }

        try {
            await User.updateOne({ name }, update, {
                runValidators: true,
                context: 'query'
            });

            return [{ updated: true }];
        } catch (e) {
            return [{ updated: false, errors: e.errors }, 422];
        }
    }

    /**
    * Create a new user
    * Requires the users data in the body
    */
    public async add(data: RequestData) {
        if (!this.can(data, 'user.create')) {
            return this.unauthorized;
        }

        const { name, email, password } = data.body;
        let { role } = data.body;

        role = await Role.findOne({ name: role });

        try {
            const user = await User.create({ name, email, password, role });
            return [{ user }];
        } catch (e) {
            const messages: { key: string, message: string }[] = [];
            Object.entries(e.errors).forEach(([key, value]: any) => {
                messages.push({ key, message: value.properties.message });
            });
            return [{ messages }, 422];
        }
    }
}
