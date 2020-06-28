import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import routes from './routes';
import { RequestData } from '../../typings/request-data';

// Import all the controllers
const controllers: Map<string, any> = new Map();
fs.readdirSync(path.join(__dirname, '../controller')).forEach(function (file) {
    if (!/\.controller\.(ts|js)$/.test(file)) return;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Controller = require(`../controller/${file}`).default;

    controllers.set(file.split('.controller')[0], new Controller());
});

// The routers
const router = Router();

async function execute(req: any, res: any, next: () => void, controller: string) {
    const check = await controllers.get('auth').auth(req);

    const user = check.user;

    const contr = controllers.get(controller.split('.')[0]);

    if (!contr) {
        return res.status(500).send({ code: 500, error: 'api.not.implemented' });
    }

    const data: RequestData = {
        user,
        body: req.body,
        params: req.params
    }

    const result = await contr[controller.split('.')[1]](data);

    res.status(result[1] || 200).send(result[0]);
}

// Register all the routes
for (const route of routes) {
    switch (route.method) {
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

// 404 route
router.use(controllers.get('api')[404]);

export default router;
