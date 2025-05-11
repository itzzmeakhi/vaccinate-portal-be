import { Router } from 'express';

import { addVaccine, getAllVaccines } from '../controllers/vaccineControllers.js';
import { protect } from './../middleware/authMiddleware.js';

const router = Router();

router.route('/').post(protect, addVaccine);
router.route('/').get(protect, getAllVaccines);

export default router;