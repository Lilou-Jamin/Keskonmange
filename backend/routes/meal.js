const express = require('express');
const { getListMeals, getMealById, addMeal } = require('../controller/meal');
const router = express.Router();

router.get('/', getListMeals);
router.get('/:id', getMealById);
router.post('/', addMeal);

module.exports = router;