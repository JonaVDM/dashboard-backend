import { RequestData } from '../../typings/request-data';
import { ResponseData } from '../../typings/response-data';

/**
 * The base controller class
 * Specify here all the things that need to be available in all the controllers
 */
export default class Controller {
    protected unauthorized: ResponseData = [{ error: 'api.unauthorized' }, 401];

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
