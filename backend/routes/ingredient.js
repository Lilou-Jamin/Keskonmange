const express = require('express');
const { getListIngredients, getIngredientById, addIngredient } = require('../controller/ingredient');
const router = express.Router();

router.get('/', getListIngredients);
router.get('/:id', getIngredientById);
// router.post('/', addIngredient);

module.exports = router;