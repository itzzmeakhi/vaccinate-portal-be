import { Router } from 'express';

import { getMetrics } from '../controllers/dashboardControllers.js';
import { protect } from './../middleware/authMiddleware.js';

const router = Router();

router.route('/metrics').get(protect, getMetrics);

export default router;