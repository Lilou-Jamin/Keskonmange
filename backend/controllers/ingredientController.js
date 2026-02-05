const Ingredients = require('../models/ingredientModel');

const getListIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredients.find();
    return res.status(200).json(ingredients);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getIngredientById = async (req, res) => {
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
