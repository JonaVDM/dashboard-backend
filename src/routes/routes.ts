import { Route } from '../../typings/route';

const routes: Route[] = [
    {
        path: '/me',
        controller: 'auth.me',
    },
    {
        path: '/login',
        method: 'post',
        controller: 'auth.login'
    },

    // Tokens
    {
        path: '/token',
        controller: 'tokens.tokens',
    },
    {
        path: '/token/:id',
        controller: 'tokens.deleteToken',
        method: 'delete',
    },

    // Users
    {
        path: '/user',
        controller: 'users.users'
    },
    {
        path: '/user/:user',
        controller: 'users.user'
    },
    {
        path: '/user',
        controller: 'users.addUser',
        method: 'post',
    },
    {
        path: '/user/:user',
        controller: 'users.editUser',
        method: 'put',
    },
    {
        path: '/user/:user',
        controller: 'users.deleteUser',
        method: 'delete',
    },

    // Roles
    {
        path: '/role',
        controller: 'roles.all',
    },
    {
        path: '/role/:name',
        controller: 'roles.single',
    },
    {
        path: '/role',
        controller: 'roles.add',
        method: 'post',
    },
    {
        path: '/role/:name',
        controller: 'roles.edit',
        method: 'put',
    },
    {
        path: '/role/:name',
        controller: 'roles.delete',
        method: 'delete',
    },

    // Profile
    {
        path: '/profile',
        controller: 'profile.all',
    },
    {
        path: '/profile/me',
        controller: 'profile.me',
    },
    {
        path: '/profile/:name',
        controller: 'profile.single',
    },
    {
        path: '/profile',
        controller: 'profile.edit',
        method: 'put'
    },
];

export default routes;
