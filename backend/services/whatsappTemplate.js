exports.ownerOrderPaid = (order) => {
  const itemsText = order.items
    .map(item => {
      return `• ${item.productId.name} – ${item.quantityInGrams} g`;
    })
    .join('\n');

  return `
🧾 *New Paid Order*

${itemsText}

💰 *Total:* ₹${order.totalAmount}
📦 *Status:* ${order.status}
🆔 *Order ID:* ${order._id}
`;
};


exports.customerPaymentSuccess = (order) => `
✅ *Payment Successful!*
Order ID: ${order._id}
Amount: ₹${order.totalAmount}
We’ll notify you when your order is ready 🙏
`;

exports.customerOrderReady = (order) => `
🎉 *Your Order is Ready!*
Order ID: ${order._id}
Please collect it at your convenience 🍬
`;
