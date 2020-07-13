import User from '../models/user';
import log from '../lib/log';
import { IRole } from '../models/role';

export default async function run(roles: IRole[]): Promise<void> {
    log('Starting the users seed'.green);

    let admin, normal;

    roles.forEach(role => {
        switch (role.name) {
            case 'admin':
                admin = role._id;
                break;

            case 'normal':
                normal = role._id;
                break;
        }
    })

    const users = [
        {
            name: 'dev',
            email: 'developer@mail.com',
            password: 'password',
            role: admin,
        },
        {
            name: 'admin',
            email: 'admin@mail.com',
            password: 'password',
            role: admin,
        },
        {
            name: 'user',
            email: 'user@mail.com',
            password: 'password',
            role: normal,
        },
    ];

    await User.create(users);
    log('Done with the users seed'.blue);
}
