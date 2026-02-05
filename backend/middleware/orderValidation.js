const { body, param } = require('express-validator');
const mongoose = require('mongoose');

exports.validatePlaceOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items array is required'),

  body('items.*.productId')
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid productId'),

  body('items.*.quantityInGrams')
    .isInt({ min: 1 })
    .withMessage('Quantity must be greater than 0')
];

exports.validateStatusUpdate = [
  param('id')
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid order ID'),

  body('status')
    .isIn(['CREATED', 'PAID', 'PREPARING', 'READY', 'COLLECTED'])
    .withMessage('Invalid status')
];
