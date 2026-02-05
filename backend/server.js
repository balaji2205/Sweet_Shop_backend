require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
// require('./routes/productRoutes');
// require('./routes/orderRoute');


const app = express();


connectDB();


app.use(cors());
app.use(express.json());
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoute'));


console.log('RAZORPAY KEY ID:', process.env.RAZORPAY_KEY_ID);

app.get('/', (req, res) => {
  res.send('Sweet Shop Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
