const Ingredients = require('../models/ingredientModel');
const { verifyToken } = require('../utils/token');

// retourne la liste de tous les ingrédients ou bien d'une recherche
// GET /?search
// query:
// - (optionnel) search: Le nom de l'ingrédient à chercher
// returns: [
//   {
//     "id_ingredient": number,
//     "str_ingredient": string,
//     "str_thumb": string,
//     "str_type": str | null
//   }
// ]
// throws:
// - 401: authentification invalide
// - 500: erreur serveur
//
const getListIngredients = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    if (req.query.search) {
      const ingredients = await Ingredients.search(req.query.search);
      return res.status(200).json(ingredients);
    } else {
      const ingredients = await Ingredients.find();
      return res.status(200).json(ingredients);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getIngredientById = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  console.log('Ingredient ID:', req.params.id);
  try {
    const ingredient = await Ingredients.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).json({ message: 'Ingrédient non trouvé.' });
    }

    return res.json(ingredient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// const addIngredient = async (req, res) => {
//   if (!verifyToken(req)) {
//     return res.status(401).json({ message: 'Invalid Authentication Token' })
//   }
//
//   try {
//     const { title, ingredients, instructions, time, image } = req.body;

//     if (!title || !ingredients || !instructions) {
//       return res
//         .status(400)
//         .json({ message: 'Tous les champs sont requis.' });
//     }

//     const newMeal = await Meals.create({
//       title,
//       ingredients,    // doit être un tableau JS pour être converti en TEXT[]
//       instructions,
//       time,
//       image,
//     });

//     return res.status(201).json(newMeal);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Erreur serveur.' });
//   }
// };

module.exports = {
  getListIngredients,
  getIngredientById,
};
