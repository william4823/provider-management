import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import 'dotenv/config';

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default {
  storage: new CloudinaryStorage({
    cloudinary: cloudinaryV2,
    params: (req, file) => ({
      folder: 'products',
      public_id: `${Date.now()}:${file.originalname}`,
    }),
  }),
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/pjpeg',
      'image/png',
      'image/gif',
    ];

    if (allowedMimes.includes(file.mimetype) || !req.file) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
};
