import { Router } from 'express';

import { createDrive, getDriveStatusAggregate, fetchDrives, vaccinate, fetchDriveById, updateDriveById } from '../controllers/driveControllers.js';

import { protect } from './../middleware/authMiddleware.js';

const router = Router();

router.route('/').post(protect, createDrive);
router.route('/').get(protect, fetchDrives);
router.route('/status').get(protect, getDriveStatusAggregate);
router.route('/vaccinate').patch(protect, vaccinate);
router.route('/:id').get(protect, fetchDriveById);
router.route('/:id').put(protect, updateDriveById);

export default router;