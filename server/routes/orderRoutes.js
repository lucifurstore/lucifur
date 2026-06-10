const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc  Create a new order
// @route POST /api/orders
// @access Public (guest) or Private (logged-in)
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, couponCode, notes, paymentMethod } = req.body;

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

    // Parse user token optionally if available in headers to link order
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Ignore token decode errors to allow guest checkout
      }
    }

    // Create Razorpay Order if paymentMethod is Razorpay
    let razorpayOrderId = null;
    if (paymentMethod === 'Razorpay') {
      const authHeader = 'Basic ' + Buffer.from(process.env.RAZORPAY_KEY_ID + ':' + process.env.RAZORPAY_KEY_SECRET).toString('base64');
      const rpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100), // in paise
          currency: 'INR',
          receipt: 'rcpt_' + Math.random().toString(36).substring(2, 10)
        })
      });
      const rpData = await rpRes.json();
      if (!rpRes.ok) {
        res.status(400);
        throw new Error(rpData.error?.description || 'Razorpay order creation failed');
      }
      razorpayOrderId = rpData.id;
    }

    const order = await Order.create({
      user: userId,
      guestEmail: !userId ? shippingAddress.email : null,
      orderItems,
      shippingAddress,
      coupon: appliedCoupon,
      subtotal,
      shippingCost,
      discount,
      totalAmount,
      notes,
      paymentMethod: paymentMethod || 'COD',
      razorpayOrderId,
    });

    res.status(201).json({
      success: true,
      data: order,
      ...(paymentMethod === 'Razorpay' ? { razorpayKeyId: process.env.RAZORPAY_KEY_ID } : {})
    });
  })
);

// @desc  Verify Razorpay payment signature
// @route POST /api/orders/verify
// @access Public
router.post(
  '/verify',
  asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400);
      throw new Error('Missing payment verification parameters');
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      res.status(404);
      throw new Error('Order not found matching this payment');
    }

    // Verify signature
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      order.paymentStatus = 'unpaid';
      await order.save();
      res.status(400);
      throw new Error('Payment signature verification failed');
    }

    // Update order status on success
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    const updatedOrder = await order.save();

    res.json({ success: true, message: 'Payment verified successfully', data: updatedOrder });
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

// @desc  Submit exchange request for an order
// @route POST /api/orders/:id/exchange
// @access Private
router.post(
  '/:id/exchange',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Verify ownership
    if (!order.user || order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to request exchange for this order');
    }

    // Verify order status is delivered
    if (order.status !== 'delivered') {
      res.status(400);
      throw new Error('Exchange can only be requested for delivered orders');
    }

    // Check if within 2 days of delivery (using deliveredAt or falling back to updatedAt if deliveredAt isn't set)
    const deliveryDate = order.deliveredAt || order.updatedAt;
    const diffTime = Math.abs(new Date() - new Date(deliveryDate));
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 2) {
      res.status(400);
      throw new Error('Exchange window of 2 days has expired');
    }

    const { items } = req.body;
    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('Please specify items to exchange');
    }

    // Map items to schema format
    order.exchangeRequest = {
      isRequested: true,
      status: 'pending',
      items: items.map(item => ({
        product: item.product || item.productId,
        name: item.name,
        size: item.size,
        newSize: item.newSize,
        reason: item.reason
      })),
      requestedAt: new Date()
    };

    await order.save();

    res.json({ success: true, message: 'Exchange request submitted successfully', data: order });
  })
);

module.exports = router;
