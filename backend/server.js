const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const { connectDB } = require('./config/connectionDb.js');
connectDB();

const userRoutes = require('./routes/userRoutes.js');

app.use(express.json());
app.use(cors());
app.use('/meals', require('./routes/mealRoutes.js'));
app.use('/ingredients', require('./routes/ingredientRoutes.js'));
app.use('/inventory', require('./routes/inventoryRoutes.js'));
app.use('/users', require('./routes/userRoutes.js'));
app.use('/auth', userRoutes);

app.get('/health', (req, res) => {
  const ip = req.ip;
  const isLocal = ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';

  if (!isLocal) {
    return res.status(404).end();
  }

  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
