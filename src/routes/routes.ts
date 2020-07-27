import { Route } from '../../typings/route';

// The middleware that needs to apply to all the routes
export const middleware: string[] = [
    'auth',
    'logger'
];

// The routes that the application needs to handle
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
        controller: 'users.all'
    },
    {
        path: '/user/:user',
        controller: 'users.single'
    },
    {
        path: '/user',
        controller: 'users.add',
        method: 'post',
    },
    {
        path: '/user/:user',
        controller: 'users.edit',
        method: 'put',
    },
    {
        path: '/user/:user',
        controller: 'users.delete',
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
