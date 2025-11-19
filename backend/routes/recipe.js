const express = require('express');
const { getRecipes, getRecipe, addRecipe } = require('../controller/recipe');
const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.post('/', addRecipe);

module.exports = router;