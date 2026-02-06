const express = require('express');
const router = express.Router();

const {
  placeOrder,
  updateOrderStatus,
  confirmPaymentMethod
} = require('../controllers/orderController');

const {
  validatePlaceOrder,
  validateStatusUpdate
} = require('../middleware/orderValidation');

const validate = require('../middleware/validate');


// =====================
// ORDER ROUTES
// =====================

// Create order
router.post(
  '/',
  validatePlaceOrder,
  validate,
  placeOrder
);

// Confirm payment method (QR / Pay Later)
router.post(
  '/confirm-payment',
  confirmPaymentMethod
);

// Update order status (owner)
router.patch(
  '/:id/status',
  validateStatusUpdate,
  validate,
  updateOrderStatus
);

module.exports = router;
