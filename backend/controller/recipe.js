// controller/recipe.js
const Recipes = require('../models/recipe');

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
    return res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recette non trouvée.' });
    }

    return res.json(recipe);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time, image } = req.body;

    if (!title || !ingredients || !instructions) {
      return res
        .status(400)
        .json({ message: 'Tous les champs sont requis.' });
    }

    const newRecipe = await Recipes.create({
      title,
      ingredients,    // doit être un tableau JS pour être converti en TEXT[]
      instructions,
      time,
      image,
    });

    return res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  addRecipe,
};
