const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Apply protect + adminOnly to all admin routes
router.use(protect, adminOnly);

// @desc  Get dashboard stats
// @route GET /api/admin/stats
// @access Admin
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ role: 'user' });

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
        recentOrders,
        ordersByStatus,
      },
    });
  })
);

// @desc  Get all orders (admin)
// @route GET /api/admin/orders
// @access Admin
router.get(
  '/orders',
  asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'name email');

    res.json({
      success: true,
      data: orders,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  })
);

// @desc  Update order status
// @route PUT /api/admin/orders/:id
// @access Admin
router.put(
  '/orders/:id',
  asyncHandler(async (req, res) => {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    if (status) {
      order.status = status;
      if (status === 'delivered' && !order.deliveredAt) {
        order.deliveredAt = new Date();
      }
    }
    if (paymentStatus) order.paymentStatus = paymentStatus;
    const updatedOrder = await order.save();
    res.json({ success: true, data: updatedOrder });
  })
);

// @desc  Update order exchange request status & notes
// @route PUT /api/admin/orders/:id/exchange
// @access Admin
router.put(
  '/orders/:id/exchange',
  asyncHandler(async (req, res) => {
    const { status, adminNotes } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (!order.exchangeRequest || !order.exchangeRequest.isRequested) {
      res.status(400);
      throw new Error('No exchange request exists for this order');
    }

    if (status) {
      order.exchangeRequest.status = status;
    }
    if (adminNotes !== undefined) {
      order.exchangeRequest.adminNotes = adminNotes;
    }

    const updatedOrder = await order.save();
    res.json({ success: true, data: updatedOrder });
  })
);

// @desc  Get all users (admin)
// @route GET /api/admin/users
// @access Admin
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  })
);

// @desc  CRUD for coupons
// @route GET/POST /api/admin/coupons
// @access Admin
router.get(
  '/coupons',
  asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  })
);

router.post(
  '/coupons',
  asyncHandler(async (req, res) => {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  })
);

router.put(
  '/coupons/:id',
  asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) {
      res.status(404);
      throw new Error('Coupon not found');
    }
    res.json({ success: true, data: coupon });
  })
);

router.delete(
  '/coupons/:id',
  asyncHandler(async (req, res) => {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  })
);

// @desc  Wishlist management (add/remove)
// @route POST /api/admin/users/:id/wishlist (admin can view)
// @access Admin
router.get(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).populate('wishlist');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({ success: true, data: user });
  })
);

module.exports = router;
