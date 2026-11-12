import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { upload } from '../../middleware/upload.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

router.post('/', requireAuth, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Tidak ada file yang diunggah' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({
    message: 'File berhasil diunggah',
    data: {
      url: fileUrl,
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  });
}));

export default router;
