import { Router } from 'express';

// The main controller
import APIController from '../controller/api.controller';

// The "sub" Controllers
import UsersController from '../controller/users.controller';
import TokensController from '../controller/tokens.controller';
import AuthController from '../controller/auth.controller';
import RolesController from '../controller/roles.controller';
import ProfileController from '../controller/profile.controller';

import { RequestData } from '../../typings/request-data';

// import the static messages
import strings from '../../lib/strings';

// Controller object
const apiController = new APIController();

// "Sub" Controller objects
const controllers: Map<string, any> = new Map();
controllers.set('RolesController', new RolesController());
controllers.set('UsersController', new UsersController());
controllers.set('AuthController', new AuthController());
controllers.set('TokensController', new TokensController());
controllers.set('ProfileController', new ProfileController());

// The routers
const router = Router();
const admin = Router();

async function execute(req: any, res: any, controller: string) {
    let user;

    if (req.originalUrl.includes('/api/admin/')) {
        const check = await controllers.get('AuthController').auth(req);

        if (!check.auth) {
            return res.status(401).send({ code: 401, error: check.error });
        }

        user = check.user;
    }

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

//
// Use 'router' for calls that don't need auth
// Use 'admin' for calls that do need auth
//

// Auth stuff
admin.get('/me', (req, res) => execute(req, res, 'AuthController.me'));
router.post('/login', (req, res) => execute(req, res, 'AuthController.login'));

// Tokens
admin.get('/token', (req, res) => execute(req, res, 'TokensController.tokens'));
admin.delete('/token/:id', (req, res) => execute(req, res, 'TokensController.deleteToken'));

// Users
admin.get('/user', (req, res) => execute(req, res, 'UsersController.users'));
admin.post('/user', (req, res) => execute(req, res, 'UsersController.addUser'));
admin.get('/user/:user', (req, res) => execute(req, res, 'UsersController.user'));
admin.put('/user/:user', (req, res) => execute(req, res, 'UsersController.editUser'));
admin.delete('/user/:user', (req, res) => execute(req, res, 'UsersController.deleteUser'));

// Roles
admin.get('/role', (req, res) => execute(req, res, 'RolesController.all'));
admin.post('/role', (req, res) => execute(req, res, 'RolesController.add'));
admin.get('/role/:role', (req, res) => execute(req, res, 'RolesController.single'));
admin.put('/role/:role', (req, res) => execute(req, res, 'RolesController.edit'));
admin.delete('/role/:role', (req, res) => execute(req, res, 'RolesController.delete'));

// Profile
admin.get('/profile', (req, res) => execute(req, res, 'ProfileController.all'));
admin.put('/profile', (req, res) => execute(req, res, 'ProfileController.edit'));
admin.get('/profile/me', (req, res) => execute(req, res, 'ProfileController.me'));
admin.get('/profile/:name', (req, res) => execute(req, res, 'ProfileController.single'));

router.use('/admin', admin);
router.use(apiController[404]);

export default router;
