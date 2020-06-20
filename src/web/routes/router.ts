import { Router } from 'express';

import api from './api.routes';

const router = Router();

router.use('/api', api);

export default router;
