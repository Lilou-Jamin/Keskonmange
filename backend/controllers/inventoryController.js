const Inventory = require('../models/inventoryModel');
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
  addToOrRemoveFromInventory,
};
