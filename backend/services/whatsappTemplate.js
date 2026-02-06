// exports.ownerOrderPaid = (order) => {
//   const itemsText = order.items
//     .map(item => {
//       return `• ${item.productId.name} – ${item.quantityInGrams} g`;
//     })
//     .join('\n');

//   return `
// 🧾 *New Paid Order*

// ${itemsText}

// 💰 *Total:* ₹${order.totalAmount}
// 📦 *Status:* ${order.status}
// 🆔 *Order ID:* ${order._id}
// `;
// };


// exports.customerPaymentSuccess = (order) => `
// ✅ *Payment Successful!*
// Order ID: ${order._id}
// Amount: ₹${order.totalAmount}
// We’ll notify you when your order is ready 🙏
// `;

// exports.customerOrderReady = (order) => `
// 🎉 *Your Order is Ready!*
// Order ID: ${order._id}
// Please collect it at your convenience 🍬
// `;




/* =========================
   OWNER TEMPLATES
========================= */

exports.ownerPaidVerify = (order) => {
  const itemsText = order.items
    .map(item => `• ${item.productId.name} – ${item.quantityInGrams} g`)
    .join('\n');

  return `
🧾 *New Order (PAID via UPI)*

${itemsText}

💰 *Total:* ₹${order.totalAmount}
📦 *Status:* PAID – Verify Screenshot
🆔 *Order ID:* ${order._id}

⚠️ Please verify the payment screenshot while handing over the order.
`;
};

exports.ownerPayLater = (order) => {
  const itemsText = order.items
    .map(item => `• ${item.productId.name} – ${item.quantityInGrams} g`)
    .join('\n');

  return `
🧾 *New Order (PAY LATER)*

${itemsText}

💰 *Total:* ₹${order.totalAmount}
📦 *Status:* Pay Later
🆔 *Order ID:* ${order._id}

💵 Collect payment during pickup.
`;
};


/* =========================
   CUSTOMER TEMPLATES
========================= */

exports.customerPaidVerify = (order) => `
✅ *Payment Done via UPI*

🆔 *Order ID:* ${order._id}
💰 *Amount:* ₹${order.totalAmount}

⚠️ Please show your payment screenshot while collecting the order.
We’ll notify you once it’s ready 🍬
`;

exports.customerPayLater = (order) => `
🧾 *Order Placed Successfully*

🆔 *Order ID:* ${order._id}
💰 *Amount:* ₹${order.totalAmount}

💵 Please pay at the shop while collecting your order.
We’ll notify you when it’s ready 🍬
`;

exports.customerOrderReady = (order) => `
🎉 *Your Order is Ready!*

🆔 *Order ID:* ${order._id}

Please collect it at your convenience 🍬
Thank you for ordering with us 🙏
`;
