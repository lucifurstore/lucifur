const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/authMiddleware');

// @desc  Create a new order
// @route POST /api/orders
// @access Public (guest) or Private (logged-in)
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, couponCode, notes } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items provided');
    }

    // Calculate subtotal
    const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Apply coupon if any
    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (!coupon || coupon.expiresAt < new Date() || coupon.usedCount >= coupon.maxUses) {
        res.status(400);
        throw new Error('Invalid or expired coupon');
      }
      if (subtotal < coupon.minOrderAmount) {
        res.status(400);
        throw new Error(`Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
      }
      if (coupon.discountType === 'percentage') {
        discount = (subtotal * coupon.discountValue) / 100;
      } else {
        discount = coupon.discountValue;
      }
      appliedCoupon = { code: coupon.code, discount };
      await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
    }

    const shippingCost = subtotal > 2000 ? 0 : 99; // Free shipping above ₹2000
    const totalAmount = subtotal - discount + shippingCost;

    const order = await Order.create({
      user: req.user ? req.user._id : null,
      guestEmail: !req.user ? shippingAddress.email : null,
      orderItems,
      shippingAddress,
      coupon: appliedCoupon,
      subtotal,
      shippingCost,
      discount,
      totalAmount,
      notes,
    });

    res.status(201).json({ success: true, data: order });
  })
);

// @desc  Get logged-in user's orders
// @route GET /api/orders/myorders
// @access Private
router.get(
  '/myorders',
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  })
);

// @desc  Get single order by ID
// @route GET /api/orders/:id
// @access Private
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    // Users can only see their own orders
    if (order.user && order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
    res.json({ success: true, data: order });
  })
);

module.exports = router;
