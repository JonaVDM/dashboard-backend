import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import routes, {middleware as mainMiddleware} from './routes';
import { RequestData } from '../../typings/request-data';
import { Route } from '../../typings/route';
import { ResponseData } from '../../typings/response-data';

// Import all the controllers
const controllers: Map<string, any> = new Map();
fs.readdirSync(path.join(__dirname, '../controller')).forEach(function (file) {
    if (!/\.controller\.(ts|js)$/.test(file)) return;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Controller = require(`../controller/${file}`).default;

    controllers.set(file.split('.controller')[0], new Controller());
});

// Import all the middleware
const middlewareList: Map<string, (arg1: any, arg2: RequestData) => Promise<RequestData>> = new Map();
const activeMiddleware: ((arg1: any, arg2: RequestData) => Promise<RequestData>)[] = [];
fs.readdirSync(path.join(__dirname, '../middleware')).forEach(function (file) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const middleware = require(`../middleware/${file}`).default;

    middlewareList.set(file.split(/.(ts|js)/)[0], middleware);
});

// The routers
const router = Router();

// The executer for routes
async function execute(req: any, res: any, next: (arg: any) => void, route: Route) {
    // Build the basic data
    let data: RequestData = {
        body: req.body,
        params: req.params
    }

    // Get the controller
    const contr = controllers.get(route.controller.split('.')[0]);
    if (!contr) {
        return res.status(500).send({ code: 500, error: 'api.not.implemented' });
    }

    // Run the middleware functions
    for (const middleware of activeMiddleware) {
        data = await(middleware(req, data));
    }

    // Run the route specified middleware
    if (route.middleware) {
        for (const middlewareName of route.middleware) {
            const middleware = middlewareList.get(middlewareName);
            data = await (middleware(req, data));
        }
    }

    let result: ResponseData;

    try {
        // Run the controllers
        result = await contr[route.controller.split('.')[1]](data);
    } catch (e) {
        return next(e);
    }

    // Send the data to the client
    res.status(result[1] || 200).send(result[0]);
}

// Register the middleware that execute on all the routes
for (const middleware of mainMiddleware) {
    const middle = middlewareList.get(middleware);
    if (middle) activeMiddleware.push(middle);
}

// Register all the routes
for (const route of routes) {
    switch (route.method) {
        case 'post':
            router.post(route.path, (req, res, next) => execute(req, res, next, route));
            break;

        case 'put':
            router.put(route.path, (req, res, next) => execute(req, res, next, route));
            break;

        case 'delete':
            router.delete(route.path, (req, res, next) => execute(req, res, next, route));
            break;

        case 'get':
        default:
            router.get(route.path, (req, res, next) => execute(req, res, next, route));
            break;
    }
}

// 404 route
router.use(controllers.get('api')[404]);

// Error handling
router.use(controllers.get('api').errors);

export default router;
