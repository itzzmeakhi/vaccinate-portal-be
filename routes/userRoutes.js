import { Router } from 'express';

import { authUser } from '../controllers/userControllers.js';

const router = Router();

router.route('/').post(authUser);
router.route('/login').post(authUser);

export default router;