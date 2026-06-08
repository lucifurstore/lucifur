const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Collection = require('../models/Collection');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc  Get all collections
// @route GET /api/collections
// @access Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const collections = await Collection.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: collections });
  })
);

// @desc  Get single collection by slug
// @route GET /api/collections/:slug
// @access Public
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const collection = await Collection.findOne({ slug: req.params.slug, isActive: true });
    if (!collection) {
      res.status(404);
      throw new Error('Collection not found');
    }
    res.json({ success: true, data: collection });
  })
);

// @desc  Create collection
// @route POST /api/collections
// @access Admin only
router.post(
  '/',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const collection = await Collection.create(req.body);
    res.status(201).json({ success: true, data: collection });
  })
);

// @desc  Update collection
// @route PUT /api/collections/:id
// @access Admin only
router.put(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!collection) {
      res.status(404);
      throw new Error('Collection not found');
    }
    res.json({ success: true, data: collection });
  })
);

// @desc  Delete collection
// @route DELETE /api/collections/:id
// @access Admin only
router.delete(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!collection) {
      res.status(404);
      throw new Error('Collection not found');
    }
    res.json({ success: true, message: 'Collection removed' });
  })
);

module.exports = router;
