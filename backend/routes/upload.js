const express = require('express');
const multer = require('multer');
const { uploadImage, uploadMultipleImages } = require('../utils/cloudinary');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new Error('Only image files are allowed!'));
  },
});

// POST /api/upload/image - single image
// POST /api/upload/image - single image - Allow authenticated users (Sellers need this)
router.post('/image', authMiddleware, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }
    const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await uploadImage(dataURI);
    if (!result || result.success === false) {
      console.error('Upload single error:', result);
    }
    if (!result || result.success === false) {
      return res.status(500).json({ success: false, message: result?.error || 'Upload failed' });
    }
    // Support both util return shapes
    const url = result.url || result.secure_url;
    return res.json({ success: true, message: 'Image uploaded successfully', data: { url } });
  } catch (err) {
    next(err);
  }
});

// POST /api/upload/images - multiple images
// POST /api/upload/images - multiple images
router.post('/images', authMiddleware, upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }
    const dataURIs = req.files.map(f => `data:${f.mimetype};base64,${f.buffer.toString('base64')}`);

    // If util exposes bulk uploader, use it; otherwise upload sequentially
    let urls = [];
    if (typeof uploadMultipleImages === 'function') {
      const bulk = await uploadMultipleImages(dataURIs);
      if (bulk && bulk.success) {
        urls = bulk.urls || [];
      } else if (bulk && Array.isArray(bulk)) {
        urls = bulk.map(r => r.secure_url || r.url).filter(Boolean);
      }
    }
    if (urls.length === 0) {
      const results = await Promise.all(dataURIs.map(uri => uploadImage(uri)));
      urls = results.map(r => r.secure_url || r.url).filter(Boolean);
    }

    if (urls.length === 0) {
      return res.status(500).json({ success: false, message: 'Image upload failed', debug: true });
    }
    return res.json({ success: true, message: 'Images uploaded successfully', data: { urls } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;