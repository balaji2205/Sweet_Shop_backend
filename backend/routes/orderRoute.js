const express = require('express');
const router = express.Router();

const {
  placeOrder,
  updateOrderStatus,
  createPaymentOrder,
  verifyPayment
} = require('../controllers/orderController');

const {
  validatePlaceOrder,
  validateStatusUpdate
} = require('../middleware/orderValidation');

const validate = require('../middleware/validate');


// =====================
// PAYMENT ROUTES FIRST
// =====================
router.post('/payment', createPaymentOrder);
router.post('/payment/verify', verifyPayment);


// =====================
// ORDER ROUTES
// =====================
router.post('/', validatePlaceOrder, validate, placeOrder);

router.patch(
  '/:id/status',
  validateStatusUpdate,
  validate,
  updateOrderStatus
);

module.exports = router;

