import strings from '../lib/strings';
import { RequestData } from '../typings/request-data';
import { ResponseData } from '../typings/response-data';

export default class Controller {
    protected unauthorized: ResponseData = [{code: 401, error: strings.ERR_UNAUTHORIZED}, 401];

    protected can(data: RequestData, ...requirements: string[]): boolean {
        if (!data.user) return false;

        // Get the user's role
        const role = data.user.role;

        if (role.permissions.includes('admin')) return true;

        for (const requirement of requirements) {
            const category = requirement.split('.')[0];
            if (!role.permissions.includes(requirement) &&
                !role.permissions.includes(category)) {
                return false;
            }
        }
        return true;
    }
}
