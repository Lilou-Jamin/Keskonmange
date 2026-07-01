const Inventory = require('../models/inventoryModel');
const Meal = require('../models/mealModel');
const { verifyToken } = require('../utils/token');

// retourne l'inventaire complet de l'utilisateur connecté
const getUserInventory = async (req, res) => {
  let joined = false;
  if (req.query.joined === '1') {
    joined = true;
  }

  const token = verifyToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const inventory = await Inventory.findByUserId(token.id, joined);

    if (!inventory) {
      return res.status(404).json({ message: 'Inventaire vide.' });
    }

    return res.json(inventory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// retourne la quantité d'un ingrédient dans l'inventaire de l'utilisateur connecté
const getUserInventoryIngredient = async (req, res) => {
  const token = verifyToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  let joined = false;
  if (req.query.joined === '1') {
    joined = true;
  }

  try {
    const ingredient = await Inventory.findByUserAndIngredientId(token.id, req.params.ingredientId, joined);

    if (!ingredient) {
      return res.status(404).json({ message: "Ingrédient non trouvé dans l'inventaire de l'utilisateur." });
    }

    return res.json(ingredient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// supprime les ingrédients avec la bonne quantité dans l'inventaire de l'utilisateur connecté
// en fonction d'un repas. Si la quantité totale devient 0 ou négative on supprime l'ingrédient de l'inventaire
const removeFromInventoryUsingMeal = async (req, res) => {
  const token = verifyToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  let nbPeople = 4;
  if (req.query['for'] && !isNaN(req.query['for']) && nbPeople > 0) {
    nbPeople = Number(req.query['for']);
  }

  try {
    const ingredients = await Meal.findMealIngredients(req.params.mealId);
    const userIngredients = await Inventory.findByUserId(token.id, true);

    for (const ingredient of ingredients) {
      const userIngredient = userIngredients.find(
        (userIngredient) => userIngredient.id_ingredient === ingredient.id_ingredient
      );
      if (!userIngredient || !userIngredient.is_countable) {
        continue;
      }

      // on suppose que les quantités de base sont pour 4 personnes
      // produit en croix pour ajuster les quantités en fonction du nombre de personnes
      const ratio = nbPeople / 4;
      const ingredientQty = Math.round(ingredient.quantity * ratio);

      if (userIngredient.qty - ingredientQty <= 0) {
        await Inventory.removeFromInventory(token.id, ingredient.id_ingredient);
      } else {
        await Inventory.updateInventory(token.id, ingredient.id_ingredient, userIngredient.qty - ingredientQty);
      }
    }

    return res.status(200).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ajoute ou supprime une quantité d'un ingrédient dans l'inventaire de l'utilisateur connecté
// si la quantité totale devient 0 ou négative on supprime l'ingrédient de l'inventaire
const addToOrRemoveFromInventory = async (req, res) => {
  const token = verifyToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  const { idIngredient, quantity } = req.body;

  if (!idIngredient) {
    return res.status(400).json({ message: 'ID ingrédient requis.' });
  }

  try {
    // on vérifie qu'il n'existe pas déjà
    const existing = await Inventory.findIngredientQuantityForUserId(token.id, idIngredient);
    if (existing) {
      if (quantity + existing.qty <= 0) {
        await Inventory.removeFromInventory(token.id, idIngredient);
      } else {
        await Inventory.updateInventory(token.id, idIngredient, quantity + existing.qty);
      }
    } else {
      await Inventory.addToInventory(token.id, idIngredient, quantity);
    }

    return res.status(200).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  getUserInventory,
  getUserInventoryIngredient,
  removeFromInventoryUsingMeal,
  addToOrRemoveFromInventory,
};
