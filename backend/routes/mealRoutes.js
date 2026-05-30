const express = require('express');
const { getListMeals, getListOf10RandomMeals, getListOf10RandomDesserts, getListOf10RandomVegetarians, getMealById, getMealIngredients, addMeal, addComment, deleteComment, getComments, getListMealsByCategory, searchMealsByName } = require('../controllers/mealController');
const router = express.Router();

router.get('/search', searchMealsByName);
router.get('/randommeals', getListOf10RandomMeals);
router.get('/randomdesserts', getListOf10RandomDesserts);
router.get('/randomvegetarians', getListOf10RandomVegetarians);
router.get('/:id/ingredients', getMealIngredients);
router.post('/', addMeal);
router.post('/:id/addcomment', addComment);
router.delete('/:id/deletecomment', deleteComment);
router.get('/:id/getcomments', getComments);
router.get('/category/:category', getListMealsByCategory);

router.get('/', getListMeals);
router.get('/:id', getMealById);

module.exports = router;
