const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const asyncHandler = require('express-async-handler');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'lucifur',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 1000, crop: 'limit', quality: 'auto' }],
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// @desc  Upload single image
// @route POST /api/upload
// @access Admin only
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error('No image file provided');
    }
    res.json({
      success: true,
      data: {
        url: req.file.path,
        publicId: req.file.filename,
      },
    });
  })
);

// @desc  Upload multiple images (up to 5)
// @route POST /api/upload/multiple
// @access Admin only
router.post(
  '/multiple',
  protect,
  adminOnly,
  upload.array('images', 5),
  asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error('No image files provided');
    }
    const urls = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));
    res.json({ success: true, data: urls });
  })
);

// @desc  Delete image from Cloudinary
// @route DELETE /api/upload/:publicId
// @access Admin only
router.delete(
  '/:publicId',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    await cloudinary.uploader.destroy(`lucifur/${req.params.publicId}`);
    res.json({ success: true, message: 'Image deleted from Cloudinary' });
  })
);

module.exports = router;
