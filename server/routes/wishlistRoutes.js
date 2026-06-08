const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc  Add product to wishlist
// @route POST /api/wishlist/:productId
// @access Private
router.post(
  '/:productId',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    if (user.wishlist.includes(productId)) {
      // Already in wishlist - remove it (toggle)
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, data: updatedUser.wishlist });
  })
);

// @desc  Get wishlist
// @route GET /api/wishlist
// @access Private
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, data: user.wishlist });
  })
);

module.exports = router;
