const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const { connectDB } = require('./config/connectionDb.js');
connectDB();

const userRoutes = require('./routes/userRoutes.js');

app.use(express.json());
app.use(cors());
app.use('/meals', require('./routes/mealRoutes.js'));
app.use('/ingredients', require('./routes/ingredientRoutes.js'));
app.use('/auth', userRoutes);

app.listen(PORT, (err) => {
    console.log(`App is running on port ${PORT}`);
});