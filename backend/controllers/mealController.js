const Meals = require('../models/mealModel');
const { verifyToken } = require('../utils/token');

const getListMeals = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const meals = await Meals.find();
    console.log('allo:', meals);
    return res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getListOf10RandomMeals = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const meals = await Meals.find10RandomMeals();
    console.log('random meals:', meals);
    return res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getMealById = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const meal = await Meals.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Recette non trouvée.' });
    }

    return res.json(meal);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const addMeal = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const { title, ingredients, instructions, time, image } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const newMeal = await Meals.create({
      title,
      ingredients, // doit être un tableau JS pour être converti en TEXT[]
      instructions,
      time,
      image,
    });

    return res.status(201).json(newMeal);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  getListMeals,
  getListOf10RandomMeals,
  getMealById,
  addMeal,
};
