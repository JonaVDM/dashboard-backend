import Controller from './controller';
import Role from '../models/role';
import User from '../models/user';

import { RequestData } from '../../typings/request-data';

export default class RolesController extends Controller {

    /**
     * Get a list with all roles
     */
    public async all(data: RequestData) {
        if (!this.can(data, 'role.read')) {
            return this.unauthorized;
        }

        const roles = await Role.find({});

        return [{ roles }];
    }

    /**
     * Get a single role
     * requires the role name in the request url under role
     */
    public async single(data: RequestData) {
        if (!this.can(data, 'role.read')) {
            return this.unauthorized;
        }

        const { name } = data.params;

        const role = await Role.findOne({ name });

        return [{ role }];
    }

    /**
     * Delete a role
     * Requires the role name in the request url under role
     */
    public async delete(data: RequestData) {
        if (!this.can(data, 'role.delete')) {
            return this.unauthorized;
        }

        const {name} = data.params;
        const r = await Role.findOne({name});
        const users = await User.find({ role: r }).populate('role').exec();
        if (users.length > 0) {
            // TODO: move the error to the model
            return [{ 'deleted': false, error: 'role.delete.users' }, 400]
        }
        const result = await Role.deleteOne({ name });

        return [{ 'deleted': !!result.deletedCount }];
    }

    /**
     * Edit a single role
     * Requires the role name in the request under role
     * Expects the role's new data in the body
     */
    public async edit(data: RequestData) {
        if (!this.can(data, 'role.update')) {
            return this.unauthorized;
        }

        const { name } = data.params;
        const update = data.body;

        try {
            await Role.updateOne({ name }, update, {
                runValidators: true,
                context: 'query'
            });
            return [{ updated: true }];
        } catch (e) {
            return [{ updated: false, errors: e.errors }, 422];
        }
    }

    /**
     * Create a new role
     * Requires the roles data in the body
     */
    public async add(data: RequestData) {
        if (!this.can(data, 'role.create')) {
            return this.unauthorized;
        }

        const name = data.body.name.trim();
        const { permissions } = data.body;

        try {
            await Role.create({ name, permissions });
            return [{ created: true }];
        } catch (e) {
            return [{ created: false, errors: e.errors }, 422];
        }
    }
}
