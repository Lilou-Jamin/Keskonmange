const express = require('express');
const { getListMeals, getListOf10RandomMeals, getListOf10RandomDesserts, getListOf10RandomVegetarians, getMealById, getMealIngredients, addMeal } = require('../controllers/mealController');
const router = express.Router();

router.get('/', getListMeals);
router.get('/randommeals', getListOf10RandomMeals);
router.get('/randomdesserts', getListOf10RandomDesserts);
router.get('/randomvegetarians', getListOf10RandomVegetarians);
router.get('/:id', getMealById);
router.get('/:id/ingredients', getMealIngredients);
router.post('/', addMeal);

module.exports = router;
