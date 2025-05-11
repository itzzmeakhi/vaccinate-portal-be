import { Router } from 'express';

import {
  createStudent,
  updateStudent,
  bulkUpload,
  getAllStudents
} from './../controllers/studentControllers.js';

import { upload } from './../middleware/uploadFile.js';
import { protect } from './../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getAllStudents);
router.post('/', protect, createStudent);
router.put('/:id', protect, updateStudent);
router.post('/bulkupload', protect, upload.single('file'), bulkUpload);

export default router;