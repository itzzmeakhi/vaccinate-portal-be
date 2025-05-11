import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join('uploads/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    console.log('Uploading file:', file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });