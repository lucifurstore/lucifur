const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc  Get all products (with filter, sort, pagination)
// @route GET /api/products
// @access Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, collection, search, sort, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };

    if (category) query.category = category.toUpperCase();
    if (collection) query.collection = collection;
    if (search) query.name = { $regex: search, $options: 'i' };

    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('collection', 'name slug');

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  })
);

// @desc  Get featured products
// @route GET /api/products/featured
// @access Public
router.get(
  '/featured',
  asyncHandler(async (req, res) => {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .limit(8)
      .populate('collection', 'name slug');
    res.json({ success: true, data: products });
  })
);

// @desc  Get single product
// @route GET /api/products/:id
// @access Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('collection', 'name slug');
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json({ success: true, data: product });
  })
);

// @desc  Create a product
// @route POST /api/products
// @access Admin only
router.post(
  '/',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  })
);

// @desc  Update a product
// @route PUT /api/products/:id
// @access Admin only
router.put(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json({ success: true, data: product });
  })
);

// @desc  Delete a product (soft delete)
// @route DELETE /api/products/:id
// @access Admin only
router.delete(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json({ success: true, message: 'Product removed' });
  })
);

module.exports = router;
