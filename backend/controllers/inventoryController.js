const Inventory = require('../models/inventoryModel');
const { verifyToken } = require('../utils/token');

// retourne l'inventaire complet de l'utilisateur authentifié
// GET /
// OU
// GET /?joined=1
// returns: [
//   {
//      id: int
//      id_user: string (uuid)
//      id_ingredient: int
//      qty: int
//   }
// ]
// OU
// returns: [
//   {
//      id: int
//      id_user: string (uuid)
//      ingredient: (ingredient)
//      qty: int
//   }
// ]
// throws:
// - 401: authentification invalide
// - 404: inventaire de l'utilisateur vide
// - 500: erreur serveur
//
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

// retourne la quantité d'un ingrédient dans l'inventaire de l'utilisateur authentifié
// GET /:ingredientId
// params:
// - :ingredientId l'ID de l'ingrédient a chercher
// returns: quantity: int
// throws:
// - 401: authentification invalide
// - 404: ingrédient non trouvé dans l'inventaire de l'utilisateur
// - 500: erreur serveur
//
const getUserInventoryIngredient = async (req, res) => {
  const token = verifyToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const inventory = await Inventory.findIngredientQuantityForUserId(token.id, req.params.ingredientId);

    if (!inventory) {
      return res.status(404).json({ message: "Ingrédient non trouvé dans l'inventaire de l'utilisateur." });
    }

    return res.json(inventory.qty);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ajout OU suppression (quantity < 0) d'un ingrédient dans l'inventaire d'un utilisateur authentifié
// POST /
// body:
// {
//    idIngredient: int
//    quantity: int
// }
// returns: 200 - OK
// throws:
// - 401: authentification invalide
// - 400: requête invalide
// - 500: erreur serveur
//
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
