import { Router } from 'express';

// The main controller
import APIController from '../controller/api.controller';

import routes from './routes';

// The "sub" Controllers
import UsersController from '../controller/users.controller';
import TokensController from '../controller/tokens.controller';
import AuthController from '../controller/auth.controller';
import RolesController from '../controller/roles.controller';
import ProfileController from '../controller/profile.controller';

import { RequestData } from '../../typings/request-data';

// import the static messages
import strings from '../lib/strings';

// Controller object
const apiController = new APIController();

// "Sub" Controller objects
const controllers: Map<string, any> = new Map();
controllers.set('roles', new RolesController());
controllers.set('users', new UsersController());
controllers.set('auth', new AuthController());
controllers.set('tokens', new TokensController());
controllers.set('profile', new ProfileController());

// The routers
const router = Router();

async function execute(req: any, res: any, next: () => void, controller: string) {
    const check = await controllers.get('auth').auth(req);

    if (!check.auth) {
        return res.status(401).send({ code: 401, error: check.error });
    }

    const user = check.user;

    const contr = controllers.get(controller.split('.')[0]);

    if (!contr) {
        return res.status(500).send({ code: 500, error: strings.ERR_NOT_IMPLEMENTED });
    }

    const data: RequestData = {
        user,
        body: req.body,
        params: req.params
    }

    const result = await contr[controller.split('.')[1]](data);

    res.status(result[1] || 200).send(result[0]);
}

for (const route of routes) {
    switch (route.method.toLowerCase()) {
        case 'post':
            router.post(route.path, (req, res, next) => execute(req, res, next, route.controller));
            break;

        case 'put':
            router.put(route.path, (req, res, next) => execute(req, res, next, route.controller));
            break;

        case 'delete':
            router.delete(route.path, (req, res, next) => execute(req, res, next, route.controller));
            break;

        case 'get':
        default:
            router.get(route.path, (req, res, next) => execute(req, res, next, route.controller));
            break;
    }
}

router.use(apiController[404]);

export default router;
