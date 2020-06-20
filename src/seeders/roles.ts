import Role, { IRole } from '../models/role';
import log from '../lib/log';

export default async function run(): Promise<IRole[]> {
    log('Starting the roles seed'.green);

    const roles = await Role.create([
        {
            role: 'admin',
            permissions: ['admin'],
        },
        {
            role: 'normal',
            permissions: ['user.read']
        }
    ]);
    log('Done with the roles seed'.blue);

    return roles;
}
