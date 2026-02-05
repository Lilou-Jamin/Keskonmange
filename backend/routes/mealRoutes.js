const express = require('express');
const { getListMeals, getListOf10RandomMeals, getMealById, addMeal } = require('../controllers/mealController');
const router = express.Router();

router.get('/', getListMeals);
router.get('/randommeals', getListOf10RandomMeals);
router.get('/:id', getMealById);
router.post('/', addMeal);

module.exports = router;
