const express = require('express');
const {
  getUserInventory,
  addToOrRemoveFromInventory,
  removeFromInventoryUsingMeal,
  getUserInventoryIngredient,
} = require('../controllers/inventoryController');
const router = express.Router();

router.get('/', getUserInventory);
router.get('/:ingredientId', getUserInventoryIngredient);
router.put('/meal/:mealId', removeFromInventoryUsingMeal);
router.post('/', addToOrRemoveFromInventory);

module.exports = router;
