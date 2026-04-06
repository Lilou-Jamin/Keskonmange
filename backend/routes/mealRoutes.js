const express = require('express');
const { getListMeals, getListOf10RandomMeals, getListOf10RandomDesserts, getListOf10RandomVegetarians, getMealById, getMealIngredients, addMeal, addComment, deleteComment, getComments, getListMealsByCategory } = require('../controllers/mealController');
const router = express.Router();

router.get('/', getListMeals);
router.get('/randommeals', getListOf10RandomMeals);
router.get('/randomdesserts', getListOf10RandomDesserts);
router.get('/randomvegetarians', getListOf10RandomVegetarians);
router.get('/:id', getMealById);
router.get('/:id/ingredients', getMealIngredients);
router.post('/', addMeal);
router.post('/:id/addcomment', addComment);
router.delete('/:id/deletecomment', deleteComment);
router.get('/:id/getcomments', getComments);
router.get('/category/:category', getListMealsByCategory);

module.exports = router;
