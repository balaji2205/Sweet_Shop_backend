const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantityInGrams: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    // status: {
    //   type: String,
    //   enum: ['CREATED', 'PAID', 'PREPARING', 'READY', 'COLLECTED'],
    //   default: 'CREATED'
    // },

    status: {
      type: String,
      enum: ['CREATED', 'PAID_PENDING_VERIFICATION','PAY_LATER', 'PREPARING', 'READY', 'COLLECTED'],
      default: 'CREATED'
    },

    customerPhone: {
      type: String,
      required: true
    },

    razorpayOrderId: {
      type: String
    },

    razorpayPaymentId: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
