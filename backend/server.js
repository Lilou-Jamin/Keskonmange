const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const { connectDB } = require('./config/connectionDb');
connectDB();

app.use(express.json());
app.use(cors());
app.use('/meals', require('./routes/meal'));
app.use('/ingredients', require('./routes/ingredient'));

app.listen(PORT, (err) => {
    console.log(`App is running on port ${PORT}`);
});