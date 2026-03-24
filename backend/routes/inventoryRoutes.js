const express = require('express');
const {
  getUserInventory,
  addToOrRemoveFromInventory,
  getUserInventoryIngredient,
} = require('../controllers/inventoryController');
const router = express.Router();

router.get('/', getUserInventory);
router.get('/:ingredientId', getUserInventoryIngredient);
router.post('/', addToOrRemoveFromInventory);

module.exports = router;
