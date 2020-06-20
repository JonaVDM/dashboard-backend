import { getUser, start, stop } from './common';

import Role from '../src/models/role';
import User from '../src/models/user';

import { expect } from 'chai';

import Controller from '../src/web/controller/profile.controller';

describe('Profile', () => {
    let controller: Controller;

    before(async () => {
        await start();

        await Role.updateOne({ role: 'normal' }, { permissions: [] });
        controller = new Controller();
    });

    after(async () => await stop());

    describe('All profiles', () => {
        it('With admin user (has access)', async () => {
            const user = await getUser('admin');
            const userCount = await User.countDocuments({});

            const res = await controller.all({ user });

            expect(res[1]).to.be.oneOf([200, undefined]);
            expect(res[0].users).to.have.lengthOf(userCount);
        });

        it('With normal user (does not have access)', async () => {
            const user = await getUser('user1');

            const res = await controller.all({ user });

            expect(res[1]).to.equal(401);

            expect(res[0].users).to.be.undefined;
            expect(res[0].error).to.be.a('string');

        });
    });

    describe('Update Profile', () => {
        it('Should update it', async () => {
            const user = await getUser('user1');
            const email = 'new@mail.com';
            const res = await controller.edit({ user, body: { email } });
            const update = await getUser('user1');

            expect(res[1]).to.be.oneOf([200, undefined]);
            expect(res[0].updated).to.equal(true);
            expect(update.email).to.equal(email);
        });

        it('Should fail to update with a invalid email', async () => {
            const user = await getUser('user1');
            const email = 'holdup';
            const res = await controller.edit({ user, body: { email } });
            const update = await getUser('user1');

            expect(res[1]).to.equal(400);
            expect(res[0].updated).to.equal(false);
            expect(update.email).to.not.equal(email);
        });
    });

    describe('Get my data', () => {
        it('Should get it', async () => {
            const user = await getUser('user1');
            const res = await controller.me({ user });

            expect(res[1]).to.be.oneOf([200, undefined]);
            expect(res[0].user.name).to.equal(user.name);
        });
    });

    describe('Get a profile', () => {
        it('Should get my own', async () => {
            const user = await getUser('admin');
            const res = await controller.single({
                user,
                params: {
                    name: user.name
                }
            });

            expect(res[1]).to.be.oneOf([200, undefined]);
            expect(res[0].user.name).to.equal(user.name);
        });

        it('Should get my own even with permission', async () => {
            const user = await getUser('user1');
            const res = await controller.single({
                user,
                params: {
                    name: user.name
                }
            });

            expect(res[1]).to.be.oneOf([200, undefined]);
            expect(res[0].user.name).to.equal(user.name);
            expect(res[0].user.role).to.not.be.undefined;
        });

        it('Should not get the profile without the discover permission', async () => {
            const user = await getUser('user1');
            const res = await controller.single({
                user,
                params: {
                    name: 'admin'
                }
            });

            expect(res[1]).to.equal(401);
            expect(res[0].error).to.be.a('string');
            expect(res[0].user).to.be.undefined;
        });

        it('Should get the profile with the discover permission', async () => {
            const user = await getUser('admin');
            const res = await controller.single({
                user,
                params: {
                    name: 'user1'
                }
            });

            expect(res[1]).to.be.oneOf([200, undefined]);
            expect(res[0].user.name).to.equal('user1');
            expect(res[0].user.role).to.not.be.undefined;
        });
    })
});
