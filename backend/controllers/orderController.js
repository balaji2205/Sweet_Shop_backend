// const Order = require('../models/order');
// const Product = require('../models/products');

// const { sendWhatsApp } = require('../services/whatsappService');
// const whatsappTemplates = require('../services/whatsappTemplate');


// exports.placeOrder = async (req, res) => {
//   try {
//     const { items, customerPhone } = req.body;

//     // if (!items || items.length === 0) {
//     //   return res.status(400).json({ message: 'No items in order' });
//     // }

//     let orderItems = [];
//     let totalAmount = 0;

//     for (let item of items) {
//       const product = await Product.findById(item.productId);

//       if (!product || !product.available) {
//         return res.status(404).json({ message: 'Product not available' });
//       }

//       const price =
//         (product.pricePerKg / 1000) * item.quantityInGrams;

//       totalAmount += price;

//       orderItems.push({
//         productId: product._id,
//         quantityInGrams: item.quantityInGrams,
//         price
//       });
//     }

//     const order = new Order({
//       items: orderItems,
//       totalAmount,
//       customerPhone
//     });

//     await order.save();

//     res.status(201).json({
//       message: 'Order placed successfully',
//       order
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };




// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const orderId = req.params.id;

//     const validTransitions = {
//       CREATED: ['PAID'],
//       PAID: ['PREPARING'],
//       PREPARING: ['READY'],
//       READY: ['COLLECTED']
//     };

//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     const allowedNextStatuses = validTransitions[order.status];

//     if (!allowedNextStatuses || !allowedNextStatuses.includes(status)) {
//       return res.status(400).json({
//         message: `Invalid status transition from ${order.status} to ${status}`
//       });
//     }

//     order.status = status;
//     await order.save();

//     res.json({
//       message: 'Order status updated successfully',
//       order
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };




// const razorpay = require('../config/razorpay');

// exports.createPaymentOrder = async (req, res) => {
//     console.log('🔥 createPaymentOrder HIT');
//   try {
//     const { orderId } = req.body;

//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     if (order.status !== 'CREATED') {
//       return res.status(400).json({ message: 'Payment already initiated' });
//     }

//     const options = {
//       amount: Math.round(order.totalAmount * 100), // paise
//       currency: 'INR',
//       receipt: order._id.toString()
//     };

//     const razorpayOrder = await razorpay.orders.create(options);

//     res.json({
//       razorpayOrderId: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency,
//       key: process.env.RAZORPAY_KEY_ID
//     });
//   } catch (error) {
//   console.error('🔥 FULL RAZORPAY ERROR:', error);
//   return res.status(500).json({
//     message: 'Payment initiation failed',
//     error: error?.error?.description || error.message
//   });
// }
// };




// const crypto = require('crypto');

// exports.verifyPayment = async (req, res) => {
//     console.log('VERIFY BODY:', req.body);
//     console.log('Customer phone:', Order.customerPhone);


//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       orderId
//     } = req.body;

//     // 1️⃣ Create expected signature
//     const body = razorpay_order_id + '|' + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest('hex');

//     // 2️⃣ Verify signature
//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({
//         message: 'Invalid payment signature'
//       });
//     }

//     // 3️⃣ Update order status to PAID
//     const order = await Order.findByIdAndUpdate(
//       orderId,
//       {
//         status: 'PAID',
//         razorpayOrderId: razorpay_order_id,
//         razorpayPaymentId: razorpay_payment_id
//       },
//       { new: true }
//     ).populate('items.productId');

//     if (!order) {
//       return res.status(404).json({
//         message: 'Order not found'
//       });
//     }

//     // 4️⃣ WhatsApp notification to OWNER
//     await sendWhatsApp({
//       to: process.env.OWNER_WHATSAPP,
//       message: whatsappTemplates.ownerOrderPaid(order)
//     });

//     // 5️⃣ WhatsApp notification to CUSTOMER
//     await sendWhatsApp({
//       to: `whatsapp:${order.customerPhone}`,
//       message: whatsappTemplates.customerPaymentSuccess(order)
//     });

//     // 6️⃣ Final response
//     res.json({
//       message: 'Payment verified successfully',
//       order
//     });

//   } catch (error) {
//     console.error('VERIFY PAYMENT ERROR:', error);
//     console.error('Payment verification error:', error);
//     res.status(500).json({
//       message: 'Payment verification failed'
//     });
//   }
// };



const Order = require('../models/order');
const Product = require('../models/products');

const { sendWhatsApp } = require('../services/whatsappService');
const whatsappTemplates = require('../services/whatsappTemplate');

/* =====================================================
   PLACE ORDER (UNCHANGED CORE LOGIC)
===================================================== */
exports.placeOrder = async (req, res) => {
  try {
    const { items, customerPhone, customerName } = req.body;

    if (!customerName) {
  return res.status(400).json({
    message: 'Customer name is required'
  });
}

    let orderItems = [];
    let totalAmount = 0;

    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not available' });
      }

      const price =
        (product.pricePerKg / 1000) * item.quantityInGrams;

      totalAmount += price;

      orderItems.push({
        productId: product._id,
        quantityInGrams: item.quantityInGrams,
        price
      });
    }

    const order = new Order({
      items: orderItems,
      totalAmount,
      customerName,
      customerPhone,
      status: 'CREATED'
    });

    await order.save();

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('PLACE ORDER ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


/* =====================================================
   UPDATE ORDER STATUS (OWNER SIDE)
===================================================== */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const validTransitions = {
      CREATED: ['PAID_PENDING_VERIFICATION', 'PAY_LATER'],
      PAID_PENDING_VERIFICATION: ['PREPARING'],
      PAY_LATER: ['PREPARING'],
      PREPARING: ['READY'],
      READY: ['COLLECTED']
    };

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const allowedNextStatuses = validTransitions[order.status];

    if (!allowedNextStatuses || !allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from ${order.status} to ${status}`
      });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('UPDATE STATUS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


/* =====================================================
   CONFIRM PAYMENT METHOD (NEW – QR / PAY LATER FLOW)
===================================================== */
exports.confirmPaymentMethod = async (req, res) => {
  try {
    const { orderId, paymentType } = req.body;

    console.log('✅ CONFIRM PAYMENT HIT:', req.body);

    if (!orderId || !paymentType) {
      return res.status(400).json({
        message: 'orderId and paymentType are required'
      });
    }

    if (!['PAY_NOW', 'PAY_LATER'].includes(paymentType)) {
      return res.status(400).json({
        message: 'Invalid payment type'
      });
    }

    const status =
      paymentType === 'PAY_NOW'
        ? 'PAID_PENDING_VERIFICATION'
        : 'PAY_LATER';

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    console.log('✅ ORDER UPDATED:', order.status);

    // =========================
    // 📲 WHATSAPP (NON-BLOCKING)
    // =========================
    try {
      if (process.env.OWNER_WHATSAPP) {
        await sendWhatsApp({
          to: process.env.OWNER_WHATSAPP,
          message:
            paymentType === 'PAY_NOW'
              ? whatsappTemplates.ownerPaidVerify(order)
              : whatsappTemplates.ownerPayLater(order)
        });
      }

      if (order.customerPhone) {
        await sendWhatsApp({
          to: `whatsapp:${order.customerPhone}`,
          message:
            paymentType === 'PAY_NOW'
              ? whatsappTemplates.customerPaidVerify(order)
              : whatsappTemplates.customerPayLater(order)
        });
      }
    } catch (whatsappError) {
      // 🔥 DO NOT FAIL THE API
      console.error('⚠️ WhatsApp failed:', whatsappError.message);
    }

    // ✅ ALWAYS RETURN SUCCESS
    return res.json({
      message: 'Payment option confirmed',
      order
    });

  } catch (error) {
    console.error('CONFIRM PAYMENT FATAL ERROR:', error);
    return res.status(500).json({
      message: 'Server error'
    });
  }
};



exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('GET ORDERS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};






/* =====================================================
   DELETE ORDER (ONLY IF COLLECTED)
===================================================== */
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    // ❗ Safety check
    if (order.status !== 'COLLECTED') {
      return res.status(400).json({
        message: 'Only collected orders can be deleted'
      });
    }

    await Order.findByIdAndDelete(id);

    res.json({
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('DELETE ORDER ERROR:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};




/* =====================================================
   🔕 RAZORPAY PART (COMMENTED FOR NOW)
===================================================== */

/*
const razorpay = require('../config/razorpay');

exports.createPaymentOrder = async (req, res) => {
  // Razorpay logic commented temporarily
};

const crypto = require('crypto');

exports.verifyPayment = async (req, res) => {
  // Razorpay verification commented temporarily
};
*/
