import Controller from './controller';
import Role from '../../models/role';
import User from '../../models/user';

import strings from '../../lib/strings';
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

        const name: string = data.params.role;

        const role = await Role.findOne({ role: name });

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

        const role: string = data.params.role;
        const r = await Role.findOne({role});
        const users = await User.find({ role: r }).populate('role').exec();
        if (users.length > 0) {
            return [{ 'deleted': false, error: strings.ERR_ROLE_DELETE_USERS }]
        }
        const result = await Role.deleteOne({ role });

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

        const role = data.params.role;
        const update = data.body;

        try {
            await Role.updateOne({ role }, update, {
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

        const role = data.body.role.trim();
        const { permissions } = data.body;

        try {
            await Role.create({ role, permissions });
            return [{ created: true, role }];
        } catch (e) {
            return [{ created: false, errors: e.errors }, 422];
        }
    }
}
