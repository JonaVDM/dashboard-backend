import { start, stop, getUser } from './common';

import Controller from '../src/controller/auth.controller';
import { expect } from 'chai';

describe('Authentication', () => {
    let controller: Controller;

    before(async () => {
        await start();
        controller = new Controller();
    });

    after(async () => {
        await stop();
    });

    describe('Logging in', () => {
        it('Should log in', async () => {
            const response = await controller.login({
                body: {
                    email: 'user@mail.com',
                    password: 'password'
                }
            });

            expect(response[1]).to.be.oneOf([200, undefined]);
            expect(response[0].token).to.be.a('string');
        });

        it('Should give an error with a wrong password', async () => {
            const response = await controller.login({
                body: {
                    email: 'user@mail.com',
                    password: '*****'
                }
            });

            expect(response[1]).to.equal(401);
            expect(response[0].token).to.be.undefined;
            expect(response[0].message).to.be.a('string');
        });
    });

    describe('My data', async () => {
        it ('Should give me my data (admin)', async () => {
            const user = await getUser('admin');
            const response = await controller.me({
                user
            });

            expect(response[1]).to.be.oneOf([200, undefined]);
            expect(response[0].user.name).to.be.a('string');
            expect(response[0].user.role.name).to.be.a('string');
        });

        it('Should not give any data (no user)', async () => {
            const response = await controller.me({});

            expect(response[1]).to.equal(401);
            expect(response[0].user).to.be.undefined;
            expect(response[0].error).to.be.a('string');
        });
    });
});
