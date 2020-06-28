import { getUser, start, stop } from './common';

import Role from '../src/models/role';

import { expect } from 'chai';

import Controller from '../src/controller/roles.controller';

describe('Roles Controller', () => {
    let controller: Controller;

    const adminUser = 'admin';
    const normalUser = 'user';

    before(async () => {
        await start();

        controller = new Controller();
    });

    after(async () => await stop());

    describe('All roles', () => {
        it('Should return the roles with the right permission', async () => {
            const user = await getUser(adminUser);
            const roleCount = await Role.countDocuments({});
            const res = await controller.all({ user });

            expect(res[1]).to.be.oneOf([200, undefined]);
            expect(res[0].roles).to.have.lengthOf(roleCount);
        });

        it('Should not return the roles with the no permission', async () => {
            const user = await getUser(normalUser);
            const res = await controller.all({ user });

            expect(res[1]).to.equal(401);
            expect(res[0].users).to.be.undefined;
            expect(res[0].error).to.be.a('string');
        });
    });

    describe('One role', () => {
        const name = 'testSingleRole';
        before(async () => {
            await Role.create({ name });
        });

        it('Should return the role with the right permission', async () => {
            const user = await getUser(adminUser);
            const res = await controller.single({ user, params: { name } });

            expect(res[1]).to.be.oneOf([200, undefined]);
            expect(res[0].role.name).to.be.a('string');
        });

        it('Should not return the role with no permission', async () => {
            const user = await getUser(normalUser);
            const res = await controller.single({ user, params: { name } });

            expect(res[1]).to.equal(401);
            expect(res[0].error).to.be.a('string');
        });

        // it('Should give an error when requesting a non-exciting role', async () => {
        //     const user = await getUser(adminUser);
        //     const res = await controller.single({ user, params: { role: 'non-exciting' } });

        //     expect(res[1]).to.equal(400);
        //     expect(res[0].role).to.be.undefined;
        //     expect(res[0].error).to.be.a('string');
        // });
    });

    describe('Delete role', () => {
        const name = 'testDeleteRole';
        before(async () => {
            await Role.create({ name });
        });

        it('Should delete the empty role with the right permission', async () => {
            const user = await getUser(adminUser);
            const res = await controller.delete({ user, params: { name } });

            expect(res[1]).to.be.oneOf([200, undefined]);
            expect(res[0].deleted).to.equal(true);

            const deleted = await Role.findOne({ name });
            expect(deleted).to.be.null;
        });

        it('Should return false on deleting non-exciting role', async () => {
            const user = await getUser(adminUser);
            const res = await controller.delete({ user, params: { name } });

            expect(res[1]).to.be.oneOf([200, undefined]);
            expect(res[0].deleted).to.equal(false);
        });

        it('Should not delete the role with the no permission', async () => {
            const user = await getUser(normalUser);
            const res = await controller.delete({ user, params: { name } });

            expect(res[1]).to.equal(401);
            expect(res[0].error).to.be.a('string');
        });

        it('Should not delete the role when it is not empty', async () => {
            const user = await getUser(adminUser);
            const role = 'normal';
            const res = await controller.delete({ user, params: { name } });

            expect(res[1]).to.equal(400);
            expect(res[0].deleted).to.equal(false);
            expect(res[0].error).to.be.a('string');

            const deleted = await Role.findOne({ role });
            expect(deleted).to.not.be.null;
        });
    });

    describe('Update role', () => {
        it('Should update the role with the right permission');
        it('Should not update the role with the no permission');
        it('Should return an error when trying to update a non-exciting role');
    });

    describe('Add role', () => {
        it('should add the role with the right permission');
        it('should not add the role with no permission');
        it('should not add the role with invalid data');
    });
});
